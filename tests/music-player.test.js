import test from "node:test";
import assert from "node:assert/strict";
import {
  createMusicPlayer,
  mediaUrl,
  normalizeSongs,
  playlistUrl,
  SHARED_API,
} from "../src/music/player.js";

class AudioMock extends EventTarget {
  constructor() {
    super();
    this._src = "";
    this.paused = true;
    this.error = null;
    this.playCalls = 0;
  }
  get src() {
    return this._src;
  }
  set src(value) {
    this._src = value;
    this.error = null;
  }
  getAttribute(name) {
    return name === "src" ? this._src : null;
  }
  removeAttribute() {
    this._src = "";
  }
  load() {}
  pause() {
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }
  play() {
    this.playCalls++;
    this.paused = false;
    this.dispatchEvent(new Event("play"));
    this.dispatchEvent(new Event("playing"));
    return Promise.resolve();
  }
}
const seed = [1, 2, 3].map((id) => ({
  name: "Song " + id,
  artist: "Artist",
  url: `https://media.example/song.mp3?id=${id}`,
}));
const ok = (songs) => ({ ok: true, json: async () => songs });
function setup(t, options = {}) {
  const audio = options.audio || new AudioMock();
  const player = createMusicPlayer({ audio, seed, storage: null, ...options });
  t.after(() => player.dispose());
  return { audio, player };
}

test("absolute media URLs remain intact; relative paths resolve safely and unsafe schemes are rejected", () => {
  const base = "https://music.example/api";
  assert.equal(
    mediaUrl("https://cdn.example/a.mp3", base),
    "https://cdn.example/a.mp3",
  );
  assert.equal(mediaUrl("/track/1", base), "https://music.example/track/1");
  assert.equal(mediaUrl("javascript:alert(1)", base), "");
  const songs = normalizeSongs(
    [
      { name: "A", artist: ["One", "Two"], url: "/1" },
      { url: "data:text/html,x" },
    ],
    base,
  );
  assert.equal(songs.length, 1);
  assert.equal(songs[0].author, "One / Two");
});

test("canplay alone never claims playback; a blocked play stays paused and offers retry", async (t) => {
  const { player, audio } = setup(t);
  audio.dispatchEvent(new Event("canplay"));
  assert.equal(player.state.playing, false);
  audio.play = async () => {
    throw Object.assign(new Error("blocked"), { name: "NotAllowedError" });
  };
  await player.toggle();
  assert.equal(player.state.playing, false);
  assert.equal(player.state.buffering, false);
  assert.match(player.state.error, /浏览器/);
});

test("a track uses its absolute URL and each ended event advances exactly one song", async (t) => {
  const { player, audio } = setup(t);
  await player.select(0);
  assert.equal(audio.src, seed[0].url);
  audio.dispatchEvent(new Event("ended"));
  assert.equal(player.state.index, 1);
  assert.equal(audio.playCalls, 2);
  await player.step(-1);
  assert.equal(player.state.index, 0);
  await player.step(-1);
  assert.equal(player.state.index, 2);
});

test("an obsolete play rejection cannot reset a newer song", async (t) => {
  const { player, audio } = setup(t);
  let rejectOld;
  audio.play = () =>
    new Promise((_, reject) => {
      rejectOld = reject;
    });
  const first = player.select(0);
  audio.play = AudioMock.prototype.play;
  await player.select(1);
  rejectOld(new Error("old request failed"));
  await first;
  assert.equal(player.state.index, 1);
  assert.equal(player.state.playing, true);
  assert.equal(player.state.error, "");
});

test("pausing during a pending play prevents a late playing event from restarting audio", async (t) => {
  const { player, audio } = setup(t);
  let resolve;
  audio.play = () =>
    new Promise((res) => {
      resolve = res;
    });
  const playing = player.select(0);
  player.pause();
  audio.paused = false;
  audio.dispatchEvent(new Event("playing"));
  resolve();
  await playing;
  assert.equal(audio.paused, true);
  assert.equal(player.state.playing, false);
});

test("the broken original API falls back to the shared playlist", async (t) => {
  const calls = [];
  const { player } = setup(t, {
    source: "original",
    fetchImpl: async (url) => {
      calls.push(url);
      return url.includes("music.zhouwu")
        ? { ok: false, status: 530 }
        : ok(seed);
    },
  });
  await player.loadPlaylist();
  assert.equal(calls.length, 2);
  assert.equal(player.state.songs.length, 3);
  assert.equal(player.state.activeApi, playlistUrl(SHARED_API));
  assert.match(player.state.message, /备用/);
});

test("changing source cancels obsolete metadata, even if the old response ignores abort", async (t) => {
  let resolveOld;
  const { player } = setup(t, {
    fetchImpl: (url) =>
      url.includes("custom.example")
        ? Promise.resolve(ok([{ ...seed[1], title: "New source" }]))
        : new Promise((resolve) => {
            resolveOld = resolve;
          }),
  });
  const oldRequest = player.loadPlaylist(true);
  await player.changeSource("custom", "https://custom.example/list");
  resolveOld(ok(seed));
  await oldRequest;
  assert.equal(player.state.songs[0].title, "New source");
  assert.equal(player.state.source, "custom");
});

test("local music survives an in-flight online refresh and blob URLs are revoked on disposal", async (t) => {
  let resolveOld;
  const { player } = setup(t, {
    fetchImpl: () =>
      new Promise((resolve) => {
        resolveOld = resolve;
      }),
  });
  const oldRequest = player.loadPlaylist(true);
  const file = Object.assign(new Blob(["audio"], { type: "audio/wav" }), {
    name: "Local.wav",
  });
  player.setLocalFiles([file]);
  const url = player.state.songs[0].url;
  resolveOld(ok(seed));
  await oldRequest;
  assert.equal(player.state.mode, "local");
  assert.equal(player.state.songs[0].title, "Local");
  assert.match(url, /^blob:/);
  player.dispose();
  await assert.rejects(fetch(url));
});

test("a timed-out playlist releases loading state and retains ready songs", async (t) => {
  const { player } = setup(t, {
    timeoutMs: 10,
    fetchImpl: (_, { signal }) =>
      new Promise((_, reject) => {
        signal.addEventListener(
          "abort",
          () =>
            reject(Object.assign(new Error("timeout"), { name: "AbortError" })),
          { once: true },
        );
      }),
  });
  await player.loadPlaylist(true);
  assert.equal(player.state.loading, false);
  assert.equal(player.state.songs.length, 3);
  assert.match(player.state.message, /更新失败/);
});

test("refreshing a reordered playlist preserves the playing song and does not restart audio", async (t) => {
  const { player, audio } = setup(t, {
    fetchImpl: async () => ok([seed[2], seed[0], seed[1]]),
  });
  await player.select(1);
  await player.loadPlaylist(true);
  assert.equal(player.state.index, 2);
  assert.equal(audio.src, seed[1].url);
  assert.equal(audio.playCalls, 1);
});

test("buffer timeout stops indefinite waiting without silently skipping tracks", async (t) => {
  const { player, audio } = setup(t, { bufferTimeoutMs: 10 });
  audio.play = () => new Promise(() => {});
  player.select(0);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(player.state.buffering, false);
  assert.equal(player.state.index, 0);
  assert.match(player.state.error, /超时/);
});

test("no fallback seed is shown for a different configured playlist", (t) => {
  const { player } = setup(t, { playlist: { id: "123" } });
  assert.equal(player.state.songs.length, 0);
});
