<template>
  <div v-if="!lyricsloaded || audioLoading" class="loading-spinner">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <v-container class="pa-0">
    <v-divider :thickness="4"></v-divider>
    <div class="pa-3">
      <div style="display: flex;width: 100%;align-items: center;">
        <v-avatar color="var(--leleo-vcard-color)" rounded="0" :image="currentSong.pic" :size="xs?48:64"></v-avatar>
        <v-btn icon @click="togglePlay" :size="xs?28:38" variant="tonal" class="ml-1">
          <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
        <v-btn icon @click="nextTrack" :size="xs?28:38" variant="tonal" class="ml-1">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
        <v-slider style="margin-bottom: -22px;padding: 0;" v-model="currentTime" :max="duration" color="var(--leleo-vcard-color)" thumb-size="12" density="compact" @update:modelValue="seek" @end="onSliderEnd" @start="onSliderStart"></v-slider>
        <span :style="xs?{'font-size':'10px'}:{'font-size':'12px'}" style="color:var(--leleo-vcard-color);">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      </div>
      <div class="lyrics-container ml-1">
        <div class="lyrics" v-if="currentLyric" :style="xs?{'font-size':'10px'}:{'font-size':'13px'}">{{ currentLyric }}</div>
        <div>
          <span :style="xs?{'font-size':'10px'}:{'font-size':'14px'}" style="opacity: 0.7;">{{ currentSong.title }}</span>
          <span :style="xs?{'font-size':'10px'}:{'font-size':'12px'}" style="opacity: 0.7;"> - {{ currentSong.author }}</span>
        </div>
      </div>
    </div>
    <v-divider :thickness="4"></v-divider>

    <v-list style="max-height: 300px;background: transparent; overflow-y: auto;" ref="songList">
      <v-list-item style="position: relative;" v-for="(song, index) in musicinfo" :key="index" @click="play(index)" :class="{ 'active-song': index === currentIndex }" ref="songItems">
        <div class="d-flex justify-space-between align-center" style="width: 100%;">
          <v-list-item-title style="color: var(--leleo-vcard-color);">
            <span style="margin-right: 12px;">{{ index+1 }}</span>
            <span>{{ song.title }}</span>
          </v-list-item-title>
          <span style="font-size: 12px; color: var(--leleo-vcard-color);">{{ song.author }}</span>
        </div>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { useDisplay } from 'vuetify';

export default {
  setup() {
    const { xs, sm } = useDisplay();
    return { xs, sm };
  },
  props: {
    musicinfo: { type: Array, required: true },
    fromLyrics: { type: Object, required: true },
    currentIndex: { type: Number, required: true },
    isPlaying: { type: Boolean, required: true },
    audioPlayer: { type: HTMLAudioElement, required: true },
    audioLoading: { type: Boolean, required: true },
  },
  data() {
    return {
      lyricsloaded: true, lyrics: [], currentLyric: "", lyricInterval: null,
      currentTime: null, duration: null,
    };
  },
  computed: {
    currentSong() { return this.musicinfo[this.currentIndex]; }
  },
  watch: {
    currentIndex() { this.loadLyrics(); this.scrollToCurrentSong(); },
    isPlaying(isPlaying) {
      if (isPlaying) this.startLyricUpdate();
      else this.stopLyricUpdate();
    }
  },
  methods: {
    async loadLyrics() {
      if (!this.currentSong.lrc) return;
      this.lyricsloaded = false;
      try {
        this.currentLyric = "";
        const response = await fetch(this.currentSong.lrc);
        const text = await response.text();
        this.lyrics = this.parseLyrics(text);
        this.$emit("update:current-lyrics", {index:this.currentIndex,lyrics:this.lyrics});
        this.lyricsloaded = true;
      } catch (error) { console.error("Failed to load lyrics:", error); }
    },
    parseLyrics(text) {
      const lines = text.split("\n");
      return lines.map(line => {
        const match = line.match(/^\[(\d+):(\d+)\.(\d+)\](.*)/);
        if (match) {
          const minutes = parseFloat(match[1]), seconds = parseFloat(match[2]), milliseconds = parseFloat(match[3]);
          const time = minutes * 60 + seconds + milliseconds / 1000;
          const text = match[4].trim();
          return { time, text };
        }
        return null;
      }).filter(line => line !== null);
    },
    updateLyric() {
      const currentTime = this.audioPlayer.currentTime;
      for (let i = this.lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= this.lyrics[i].time) { this.currentLyric = this.lyrics[i].text; break; }
      }
    },
    startLyricUpdate() { this.lyricInterval = setInterval(() => { this.updateLyric(); }, 100); },
    stopLyricUpdate() { if (this.lyricInterval) { clearInterval(this.lyricInterval); this.lyricInterval = null; } },
    play(index) {
      if (index === this.currentIndex && this.isPlaying) { this.togglePlay(); }
      else { this.$emit("update:current-index", index); this.$emit("update:is-playing", true); }
    },
    togglePlay() {
      if (this.isPlaying) this.audioPlayer.pause();
      else this.audioPlayer.play();
      this.$emit("update:is-playing", !this.isPlaying);
    },
    nextTrack() {
      const nextIndex = (this.currentIndex + 1) % this.musicinfo.length;
      this.$emit("update:current-index", nextIndex);
      this.$emit("update:is-playing", true);
    },
    scrollToCurrentSong() {
      const items = this.$refs.songItems;
      if (items && items[this.currentIndex]) {
        const el = items[this.currentIndex].$el || items[this.currentIndex];
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    updateTime() { this.currentTime = this.audioPlayer.currentTime; },
    updateDuration() { this.duration = this.audioPlayer.duration; },
    seek(time) { this.audioPlayer.currentTime = time; },
    onSliderStart() { this.audioPlayer.pause(); this.$emit("update:is-playing", false); },
    onSliderEnd() { this.audioPlayer.play(); this.$emit("update:is-playing", true); },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  mounted() {
    if(this.fromLyrics.index>=0 && this.currentIndex == this.fromLyrics.index){
      this.lyrics = this.fromLyrics.lyrics;
      this.startLyricUpdate();
    } else {
      if(this.isPlaying == true){ this.startLyricUpdate(); this.duration = this.audioPlayer.duration; }
      this.loadLyrics();
    }
    this.audioPlayer.addEventListener('timeupdate', this.updateTime);
    this.audioPlayer.addEventListener('loadedmetadata', this.updateDuration);
    this.duration = this.audioPlayer.duration;
    this.scrollToCurrentSong();
  },
  beforeDestroy() {
    this.stopLyricUpdate();
    this.audioPlayer.removeEventListener('timeupdate', this.updateTime);
    this.audioPlayer.removeEventListener('loadedmetadata', this.updateDuration);
  }
};
</script>

<style scoped>
.loading-spinner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
.lyrics-container { width: 100%; margin-top: 10px; }
.lyrics { width: 100%; color: var(--leleo-vcard-color); }
.v-list { border-radius: 0 0 8px 8px; }
.v-list-item { border-bottom: solid 1px rgba(0, 0, 0, 0.3); min-height: 40px !important; padding-top: 8px !important; padding-bottom: 8px !important; }
.v-list-item-title { font-size: 12px; }
.active-song { background-color: rgba(0, 0, 0, 0.3); border-radius: 4px; }
.v-list::-webkit-scrollbar { width: 5px; }
.v-list::-webkit-scrollbar-thumb { background-color: #888; border-radius: 4px; }
</style>
