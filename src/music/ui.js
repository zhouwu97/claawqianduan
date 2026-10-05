import { createMusicPlayer, mediaUrl, SHARED_API } from "./player.js";
import seed from "./seed.json";

export function initMusicUI({ audio, $, $$, toast, openMusic, config = {} }) {
  let source = config.source || "shared",
    customApi = config.api || "";
  try {
    source = localStorage.getItem("junko-music-source") || source;
    customApi = localStorage.getItem("junko-music-api") || customApi;
  } catch {}
  if (!["shared", "original", "custom"].includes(source)) source = "shared";
  if (source === "custom" && !mediaUrl(customApi)) source = "shared";
  let player,
    revision = -1,
    displayedUrl = "",
    lyrics = [],
    lyricVersion = 0,
    lyricController;
  const abort = new AbortController();
  const listen = (el, type, fn) =>
    el.addEventListener(type, fn, { signal: abort.signal });
  function renderSongs(state) {
    $("#songList").replaceChildren();
    state.songs.forEach((song, index) => {
      const button = document.createElement("button");
      button.className = "song-item";
      button.innerHTML =
        '<span class="song-num"></span><span class="song-name"></span><small></small>';
      button.querySelector(".song-num").textContent = String(
        index + 1,
      ).padStart(2, "0");
      button.querySelector(".song-name").textContent = song.title;
      button.querySelector("small").textContent = song.author;
      button.setAttribute("aria-label", "播放 " + song.title);
      listen(button, "click", () =>
        index === player.state.index && audio.getAttribute("src")
          ? player.toggle()
          : player.select(index),
      );
      $("#songList").append(button);
    });
  }
  async function readLyrics(song, mode) {
    lyrics = [];
    $("#lyric").textContent = "";
    const version = ++lyricVersion;
    lyricController?.abort();
    if (!song?.lrc || mode === "local") {
      $("#lyric").textContent =
        mode === "local" ? "本地音乐 · 只在当前浏览器播放" : "暂无歌词";
      return;
    }
    lyricController = new AbortController();
    const controller = lyricController,
      timer = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(song.lrc, { signal: controller.signal });
      if (!response.ok) throw new Error("歌词请求失败");
      const text = await response.text();
      if (version !== lyricVersion || abort.signal.aborted) return;
      for (const line of text.split("\n")) {
        const content = line.replace(/\[[^\]]*\]/g, "").trim();
        for (const match of line.matchAll(/\[(\d+):(\d+)(?:\.(\d+))?\]/g)) {
          lyrics.push({
            time:
              Number(match[1]) * 60 +
              Number(match[2]) +
              Number("0." + (match[3] || "0")),
            text: content,
          });
        }
      }
      lyrics.sort((a, b) => a.time - b.time);
      $("#lyric").textContent = lyrics.length
        ? "跟着音乐，慢一点。"
        : "暂无歌词";
    } catch {
      if (version === lyricVersion && !abort.signal.aborted)
        $("#lyric").textContent = "歌词暂时不可用，音乐继续播放。";
    } finally {
      clearTimeout(timer);
    }
  }
  function render(state) {
    if (state.revision !== revision) {
      revision = state.revision;
      renderSongs(state);
    }
    const song = state.currentSong;
    $$("[data-song-title]").forEach((el) => {
      el.textContent = song?.title || "尚未加载歌曲";
    });
    $$("[data-song-author]").forEach((el) => {
      el.textContent = song?.author || "点击连接歌单";
    });
    const pending = state.buffering;
    document.body.classList.toggle("playing", state.playing);
    $$('[data-music="play"]').forEach((button) => {
      button.setAttribute(
        "aria-label",
        state.playing || pending ? "暂停音乐" : "播放音乐",
      );
      button
        .querySelector("use")
        .setAttribute(
          "href",
          state.playing || pending ? "#i-pause" : "#i-play",
        );
    });
    $("#musicStatus").textContent = state.error
      ? "未能播放"
      : pending
        ? "歌曲缓冲中"
        : state.playing
          ? "播放中"
          : audio.getAttribute("src")
            ? "已暂停"
            : "点击播放";
    $("#musicMessage").hidden =
      !state.loading && !state.message && !state.error;
    $("#musicMessage").textContent =
      state.error || state.message || (state.loading ? "正在更新歌单…" : "");
    $("#retryMusic").disabled = state.loading || state.mode === "local";
    const label =
      state.mode === "local"
        ? "本地音乐"
        : state.activeApi?.startsWith(SHARED_API)
          ? "在线歌单"
          : state.source === "original"
            ? "原站接口"
            : "自定义接口";
    $("#musicSourceLabel").textContent =
      label + " · " + state.songs.length + " 首";
    $("#connectionLatency").textContent = state.latency;
    $$(".song-item").forEach((el, i) =>
      el.classList.toggle("selected", i === state.index),
    );
    // Update cover/lyrics only after a track change, not on every playback event.
    if (audio.getAttribute("src") && song?.url !== displayedUrl) {
      displayedUrl = song?.url || "";
      $("#seek").value = 0;
      $("#currentTime").textContent = "0:00";
      $("#duration").textContent = "0:00";
      $("#albumCover").replaceChildren();
      if (song?.pic) {
        const img = document.createElement("img");
        img.src = song.pic;
        img.alt = "歌曲封面";
        img.loading = "lazy";
        img.referrerPolicy = "no-referrer";
        listen(img, "error", () => {
          img.remove();
          $("#albumCover").textContent = "♫";
        });
        $("#albumCover").append(img);
      } else $("#albumCover").textContent = "♫";
      // Seed metadata is immediate, but no remote artwork/lyrics is requested until playback or music-panel open.
      if (audio.getAttribute("src")) readLyrics(song, state.mode);
    }
  }
  player = createMusicPlayer({
    audio,
    seed,
    source,
    customApi,
    playlist: config,
    onChange: render,
  });
  async function loadMusic(force = false) {
    if (player.state.mode === "local") return player.state.songs;
    // Refresh seeded/cached metadata in the background; never wait for it to play a known track.
    return player.loadPlaylist(force || !player.state.loading);
  }
  $$("[data-music]").forEach((button) =>
    listen(button, "click", async () => {
      if (button.dataset.music === "play") await player.toggle();
      else await player.step(button.dataset.music === "next" ? 1 : -1);
      if (!player.state.songs.length) openMusic();
      if (player.state.error) toast(player.state.error);
    }),
  );
  listen($("#retryMusic"), "click", () => player.loadPlaylist(true));
  $("#musicSource").value = source;
  $("#customMusicApi").value = customApi;
  $("#customApiField").hidden = source !== "custom";
  async function changeSource(next, custom = player.state.customApi) {
    try {
      const promise = player.changeSource(next, custom);
      try {
        localStorage.setItem("junko-music-source", next);
        localStorage.setItem("junko-music-api", custom);
      } catch {}
      await promise;
    } catch (error) {
      toast(error.message);
    }
  }
  listen($("#musicSource"), "change", (event) => {
    $("#customApiField").hidden = event.target.value !== "custom";
    if (event.target.value !== "custom") changeSource(event.target.value);
  });
  listen($("#applyMusicApi"), "click", () =>
    changeSource("custom", $("#customMusicApi").value.trim()),
  );
  listen($("#localMusic"), "change", (event) => {
    if (!player.setLocalFiles(event.target.files))
      toast("请选择可播放的音频文件。");
  });
  const timeFormat = (value) =>
    Number.isFinite(value) && value >= 0
      ? Math.floor(value / 60) +
        ":" +
        String(Math.floor(value % 60)).padStart(2, "0")
      : "0:00";
  listen(audio, "timeupdate", () => {
    $("#currentTime").textContent = timeFormat(audio.currentTime);
    $("#duration").textContent = timeFormat(audio.duration);
    $("#seek").value =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? (audio.currentTime / audio.duration) * 100
        : 0;
    for (let i = lyrics.length - 1; i >= 0; i--)
      if (audio.currentTime >= lyrics[i].time) {
        $("#lyric").textContent = lyrics[i].text;
        break;
      }
  });
  listen(audio, "loadedmetadata", () => {
    $("#duration").textContent = timeFormat(audio.duration);
  });
  listen($("#seek"), "input", (event) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0)
      audio.currentTime = (Number(event.target.value) / 100) * audio.duration;
  });
  const playlistLink = document.querySelector(".playlist-link");
  if (playlistLink && (!config.server || config.server === "netease"))
    playlistLink.href =
      "https://music.163.com/playlist?id=" +
      encodeURIComponent(config.id || "2028178887");
  return {
    loadMusic,
    dispose() {
      abort.abort();
      lyricVersion++;
      lyricController?.abort();
      player.dispose();
    },
  };
}
