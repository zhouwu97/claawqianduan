export const SHARED_API = "https://api.injahow.cn/meting/";
export const ORIGINAL_API = "https://music.zhouwu.ccwu.cc/api";

export function playlistUrl(base, config = {}) {
  const url = new URL(base);
  for (const [key, value] of Object.entries({
    server: "netease",
    type: "playlist",
    id: "2028178887",
    ...config,
  })) {
    if (["server", "type", "id"].includes(key))
      url.searchParams.set(key, value);
  }
  return url.href;
}

export function mediaUrl(raw, base) {
  if (typeof raw !== "string" || !raw.trim()) return "";
  try {
    const url = new URL(raw, base);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function normalizeSongs(payload, base) {
  const list = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(list)) return [];
  return list
    .flatMap((song) => {
      if (!song || typeof song !== "object") return [];
      const url = mediaUrl(song.url, base);
      if (!url) return [];
      const author = song.author ?? song.artist ?? "未知歌手";
      return [
        {
          title: String(song.title ?? song.name ?? "未知歌曲"),
          author: Array.isArray(author) ? author.join(" / ") : String(author),
          url,
          pic: mediaUrl(song.pic ?? song.cover, base),
          lrc: mediaUrl(song.lrc, base),
        },
      ];
    })
    .slice(0, 300);
}

function identity(song) {
  if (!song) return "";
  const url = new URL(song.url);
  return `${url.searchParams.get("server") || ""}:${url.searchParams.get("id") || song.title}:${song.author}`;
}

/** Playback state follows the media element, never a button click or canplay. */
export function createMusicPlayer({
  audio,
  seed = [],
  source = "shared",
  customApi = "",
  playlist = {},
  storage = globalThis.localStorage,
  fetchImpl = globalThis.fetch,
  timeoutMs = 12000,
  bufferTimeoutMs = 25000,
  onChange = () => {},
} = {}) {
  const urls = {
    shared: playlistUrl(SHARED_API, playlist),
    original: playlistUrl(ORIGINAL_API, playlist),
  };
  const state = {
    songs: [],
    index: 0,
    source,
    customApi,
    mode: "online",
    playing: false,
    loading: false,
    buffering: false,
    error: "",
    message: "",
    activeApi: "",
    latency: "",
    revision: 0,
  };
  let disposed = false,
    requestId = 0,
    trackId = 0,
    request = null,
    requestController = null;
  let wantsPlay = false,
    bufferTimer = null,
    localUrls = [];
  const listeners = [];
  const cacheKey = "chunhezi-music-cache-v2";
  function notify() {
    if (!disposed)
      onChange({ ...state, currentSong: state.songs[state.index] });
  }
  function patch(values) {
    Object.assign(state, values);
    notify();
  }
  function api() {
    return state.source === "custom"
      ? state.customApi
      : urls[state.source] || urls.shared;
  }
  function clearBuffer() {
    clearTimeout(bufferTimer);
    bufferTimer = null;
  }
  function stopAudio() {
    wantsPlay = false;
    trackId++;
    clearBuffer();
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    Object.assign(state, { playing: false, buffering: false });
  }
  function releaseLocal() {
    localUrls.forEach((url) => URL.revokeObjectURL(url));
    localUrls = [];
  }
  function invalidateRequest() {
    requestId++;
    requestController?.abort();
    requestController = null;
    request = null;
    state.loading = false;
  }
  function restore() {
    state.songs = [];
    try {
      const cached = JSON.parse(storage?.getItem(cacheKey) || "null");
      if (cached?.source === api())
        state.songs = normalizeSongs(cached.songs, api());
    } catch {
      /* Storage may be unavailable or damaged. */
    }
    if (
      !state.songs.length &&
      state.source === "shared" &&
      urls.shared === playlistUrl(SHARED_API)
    ) {
      state.songs = normalizeSongs(seed, urls.shared);
    }
    state.activeApi = api();
    state.index = 0;
    state.revision++;
    notify();
  }
  async function fetchList(url, signal) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) controller.abort();
    const timer = setTimeout(abort, timeoutMs);
    try {
      const response = await fetchImpl(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const songs = normalizeSongs(await response.json(), url);
      if (!songs.length) throw new Error("接口没有返回可播放歌曲");
      return songs;
    } finally {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
    }
  }
  function loadPlaylist(force = false) {
    if (disposed || state.mode === "local") return Promise.resolve(state.songs);
    if (request) return request;
    if (state.songs.length && !force) return Promise.resolve(state.songs);
    const id = ++requestId,
      requestedApi = api(),
      controller = new AbortController();
    requestController = controller;
    patch({ loading: true, message: "正在更新歌单…" });
    const start = Date.now();
    request = (async () => {
      try {
        let usedApi = requestedApi,
          list;
        try {
          list = await fetchList(usedApi, controller.signal);
        } catch (error) {
          if (controller.signal.aborted || state.source !== "original")
            throw error;
          usedApi = urls.shared;
          list = await fetchList(usedApi, controller.signal);
        }
        if (id !== requestId || disposed || state.mode === "local")
          return state.songs;
        const selected = identity(state.songs[state.index]);
        const index = list.findIndex((song) => identity(song) === selected);
        // A background refresh must not relabel an audio element that is still playing.
        if (audio.getAttribute("src") && index < 0 && state.songs[state.index])
          list.unshift(state.songs[state.index]);
        state.songs = list;
        state.index = index >= 0 ? index : 0;
        state.revision++;
        state.activeApi = usedApi;
        state.message =
          usedApi !== requestedApi ? "原站接口暂不可用，已切换备用歌单。" : "";
        state.latency = ((Date.now() - start) / 1000).toFixed(1) + "s";
        try {
          storage?.setItem(
            cacheKey,
            JSON.stringify({ source: requestedApi, songs: list }),
          );
        } catch {}
        return list;
      } catch (error) {
        if (id !== requestId || disposed) return state.songs;
        state.message = state.songs.length
          ? "歌单更新失败，已有歌曲仍可尝试播放。"
          : "歌单连接失败，请重试、更换来源或选择本地音乐。";
        return state.songs;
      } finally {
        if (id === requestId && !disposed) {
          request = null;
          requestController = null;
          state.loading = false;
          notify();
        }
      }
    })();
    return request;
  }
  function reportFailure(message) {
    wantsPlay = false;
    clearBuffer();
    audio.pause();
    patch({ playing: false, buffering: false, error: message });
  }
  async function play() {
    if (disposed) return false;
    const id = trackId;
    wantsPlay = true;
    patch({ error: "", buffering: true });
    clearBuffer();
    bufferTimer = setTimeout(() => {
      if (id === trackId && wantsPlay && !state.playing)
        reportFailure("歌曲连接超时，请换一首或选择本地音乐。");
    }, bufferTimeoutMs);
    try {
      // Call play synchronously inside the click path to retain browser user activation.
      await audio.play();
      return id === trackId && wantsPlay;
    } catch (error) {
      if (
        id !== trackId ||
        !wantsPlay ||
        disposed ||
        error.name === "AbortError"
      )
        return false;
      reportFailure(
        error.name === "NotAllowedError"
          ? "浏览器阻止了播放，请再点击一次播放。"
          : "这首歌暂时无法播放，请换一首或选择本地音乐。",
      );
      return false;
    }
  }
  function select(index, autoPlay = true) {
    if (!state.songs.length || disposed) return Promise.resolve(false);
    wantsPlay = false;
    trackId++;
    clearBuffer();
    audio.pause();
    state.index =
      ((index % state.songs.length) + state.songs.length) % state.songs.length;
    state.error = "";
    state.buffering = false;
    state.playing = false;
    audio.src = state.songs[state.index].url;
    notify();
    return autoPlay ? play() : Promise.resolve(true);
  }
  function pause() {
    wantsPlay = false;
    clearBuffer();
    audio.pause();
    patch({ playing: false, buffering: false });
  }
  async function toggle() {
    if (wantsPlay || !audio.paused) {
      pause();
      return false;
    }
    if (!state.songs.length) await loadPlaylist();
    if (!state.songs.length) return false;
    if (!audio.getAttribute("src") || audio.error) return select(state.index);
    return play();
  }
  async function step(delta) {
    if (!state.songs.length) await loadPlaylist();
    return select(state.index + delta);
  }
  function changeSource(nextSource, nextCustom = state.customApi) {
    if (!["shared", "original", "custom"].includes(nextSource))
      throw new Error("未知音乐来源");
    if (nextSource === "custom" && !mediaUrl(nextCustom))
      throw new Error("请输入完整的 HTTP 或 HTTPS 接口地址");
    invalidateRequest();
    stopAudio();
    releaseLocal();
    Object.assign(state, {
      source: nextSource,
      customApi: nextCustom,
      mode: "online",
      error: "",
      message: "",
      latency: "",
    });
    restore();
    return loadPlaylist(true);
  }
  function setLocalFiles(files) {
    const valid = [...files].filter(
      (file) =>
        file.type.startsWith("audio/") ||
        /\.(mp3|m4a|wav|ogg|flac|aac)$/i.test(file.name),
    );
    if (!valid.length) return false;
    invalidateRequest();
    stopAudio();
    releaseLocal();
    localUrls = valid.map((file) => URL.createObjectURL(file));
    state.songs = valid.map((file, i) => ({
      title: file.name.replace(/\.[^.]+$/, ""),
      author: "本地音乐",
      url: localUrls[i],
      pic: "",
      lrc: "",
    }));
    Object.assign(state, {
      mode: "local",
      index: 0,
      error: "",
      message: "",
      latency: "无需联网",
      revision: state.revision + 1,
    });
    select(0);
    return true;
  }
  function on(event, handler) {
    audio.addEventListener(event, handler);
    listeners.push([event, handler]);
  }
  on("play", () => {
    if (!wantsPlay) audio.pause();
  });
  on("playing", () => {
    if (!wantsPlay) {
      audio.pause();
      return;
    }
    clearBuffer();
    patch({ playing: true, buffering: false, error: "" });
  });
  on("pause", () => patch({ playing: false }));
  on("waiting", () => {
    if (!wantsPlay) return;
    clearBuffer();
    patch({ playing: false, buffering: true });
    bufferTimer = setTimeout(() => {
      if (wantsPlay) reportFailure("歌曲缓冲超时，请换一首或选择本地音乐。");
    }, bufferTimeoutMs);
  });
  on("error", () => {
    if (audio.getAttribute("src"))
      reportFailure("歌曲链接不可用，请换一首或选择本地音乐。");
  });
  on("ended", () => {
    if (wantsPlay && state.songs.length) select(state.index + 1);
  });
  function dispose() {
    disposed = true;
    invalidateRequest();
    stopAudio();
    releaseLocal();
    listeners.forEach(([event, handler]) =>
      audio.removeEventListener(event, handler),
    );
  }
  restore();
  return {
    state,
    loadPlaylist,
    select,
    play,
    pause,
    toggle,
    step,
    changeSource,
    setLocalFiles,
    dispose,
  };
}
