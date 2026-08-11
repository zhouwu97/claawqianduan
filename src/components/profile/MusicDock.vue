<template>
  <div class="music" v-if="currentSong">
    <img class="album" :src="currentSong.pic" alt="" loading="lazy">
    <div class="song" @click="emit('open-music')" :title="currentSong.title">
      <strong>{{ currentSong.title || '未知歌曲' }}</strong>
      <small>{{ currentSong.author || '未知作者' }}</small>
    </div>
    <div class="music-controls">
      <button class="play" @click="emit('prev')" aria-label="上一首">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
      </button>
      <button class="play" @click="emit('toggle-play')" :aria-label="isPlaying ? '暂停' : '播放'">
        <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button class="play" @click="emit('next')" aria-label="下一首">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['currentSong', 'isPlaying'],
  emits: ['toggle-play', 'prev', 'next', 'open-music'],
  setup(_, { emit }) {
    return { emit }
  }
}
</script>
