import { ref, computed, watch, onBeforeUnmount } from 'vue'

const MUSIC_API = 'https://music.zhouwu.ccwu.cc/api'
const MUSIC_BASE = 'https://music.zhouwu.ccwu.cc'

/**
 * 音乐播放器：歌单获取 / 播放控制 / 歌词 / 音频事件
 */
export function useMusicPlayer() {
  const musicinfo = ref(null)
  const musicinfoLoading = ref(false)
  const playlistIndex = ref(0)
  const isPlaying = ref(false)
  const audioLoading = ref(false)
  const lyrics = ref({})
  const audioPlayer = ref(null)

  const currentSong = computed(() => musicinfo.value?.[playlistIndex.value])

  // 保留原逻辑：audioLoading 变化时同步 isPlaying
  watch(audioLoading, (val) => {
    isPlaying.value = !val
  })

  function registerAudio(el) {
    audioPlayer.value = el
  }

  async function getMusicInfo(cfg) {
    musicinfoLoading.value = true
    try {
      const response = await fetch(
        `${MUSIC_API}?server=${cfg.musicPlayer.server}&type=${cfg.musicPlayer.type}&id=${cfg.musicPlayer.id}`
      )
      if (!response.ok) throw new Error('网络请求失败')
      musicinfo.value = await response.json()
      musicinfoLoading.value = false
    } catch (error) {
      console.error('请求失败:', error)
      musicinfoLoading.value = false
    }
  }

  function setupAudioListener() {
    if (audioPlayer.value) {
      audioPlayer.value.addEventListener('ended', nextTrack)
    }
  }

  function togglePlay() {
    if (!isPlaying.value) {
      audioPlayer.value?.play()
    } else {
      audioPlayer.value?.pause()
    }
    isPlaying.value = !isPlaying.value
  }

  function previousTrack() {
    if (!musicinfo.value) return
    playlistIndex.value = playlistIndex.value > 0 ? playlistIndex.value - 1 : musicinfo.value.length - 1
    updateAudio()
  }

  function nextTrack() {
    if (!musicinfo.value) return
    playlistIndex.value = playlistIndex.value < musicinfo.value.length - 1 ? playlistIndex.value + 1 : 0
    updateAudio()
  }

  function updateAudio() {
    if (!currentSong.value) return
    audioPlayer.value.src = `${MUSIC_BASE}${currentSong.value.url}`
    isPlaying.value = true
    audioPlayer.value?.play()
  }

  function updateCurrentIndex(index) {
    playlistIndex.value = index
    updateAudio()
  }

  function updateIsPlaying(val) {
    isPlaying.value = val
  }

  function updateLyrics(val) {
    lyrics.value = val
  }

  function onWaiting() {
    audioLoading.value = true
  }

  function onCanPlay() {
    audioLoading.value = false
  }

  onBeforeUnmount(() => {
    if (audioPlayer.value) {
      audioPlayer.value.removeEventListener('ended', nextTrack)
    }
  })

  return {
    musicinfo,
    musicinfoLoading,
    playlistIndex,
    isPlaying,
    audioLoading,
    lyrics,
    audioPlayer,
    currentSong,
    registerAudio,
    getMusicInfo,
    setupAudioListener,
    togglePlay,
    previousTrack,
    nextTrack,
    updateAudio,
    updateCurrentIndex,
    updateIsPlaying,
    updateLyrics,
    onWaiting,
    onCanPlay,
  }
}
