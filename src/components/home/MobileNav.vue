<template>
  <div class="mobile-nav">
    <!-- 顶部身份胶囊 -->
    <header class="mobile-top">
      <div class="mobile-id">
        <div class="mobile-avatar" v-if="avatar"><img :src="avatar" alt=""></div>
        <div>
          <strong>{{ name }}</strong>
          <small>{{ tagline }}</small>
        </div>
      </div>
      <button class="more-btn" @click="openSheet" aria-label="更多">•••</button>
    </header>

    <!-- 底部 Dock：首页 / 项目 / 近况 / 更多 -->
    <nav class="bottom-dock">
      <div class="dock-indicator" :style="{ '--dock-active': dockIndex }"></div>
      <button class="dock-item" :class="{ active: active === 'top' }" @click="nav('top')">
        <span class="ico">⌂</span><small>首页</small>
      </button>
      <button class="dock-item" :class="{ active: active === 'projects' }" @click="nav('projects')">
        <span class="ico">◇</span><small>项目</small>
      </button>
      <button class="dock-item" :class="{ active: active === 'skills' }" @click="nav('skills')">
        <span class="ico">○</span><small>近况</small>
      </button>
      <button class="dock-item" @click="openSheet">
        <span class="ico">•••</span><small>更多</small>
      </button>
    </nav>

    <!-- More Bottom Sheet -->
    <div class="sheet-backdrop" :class="{ open: sheetOpen }" @click="closeSheet"></div>
    <aside class="more-sheet" :class="{ open: sheetOpen }">
      <div class="sheet-handle"></div>
      <div class="sheet-profile">
        <div class="mobile-avatar" v-if="avatar"><img :src="avatar" alt=""></div>
        <div><strong>{{ name }}</strong><small>{{ location }}</small></div>
      </div>
      <div class="sheet-card"><h4>ABOUT ME</h4><p>{{ quote }}</p></div>
      <div class="sheet-card"><h4>NOW PLAYING</h4><p>{{ nowPlaying }}</p></div>
      <div class="sheet-actions">
        <a class="sheet-action" :href="githubUrl" target="_blank" rel="noreferrer">GitHub</a>
        <button class="sheet-action" @click="act('open-settings')">Music</button>
        <button class="sheet-action" @click="act('open-about')">About</button>
        <button class="sheet-action" @click="act('clear-screen')">清屏</button>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export default {
  props: {
    active: { type: String, default: 'top' },
    configdata: { type: Object, default: () => ({}) },
    currentSong: { type: Object, default: null },
  },
  emits: ['navigate', 'open-about', 'open-settings', 'clear-screen'],
  setup(props, { emit }) {
    const sheetOpen = ref(false)

    const dockIndex = computed(() => ({ top: 0, projects: 1, skills: 2 })[props.active] ?? 0)
    const avatar = computed(() => props.configdata.avatar || '')
    const name = computed(() => props.configdata.name || '周周')
    const tagline = computed(() => props.configdata.hero?.tagline || 'Developer · Student')
    const location = computed(() => props.configdata.hero?.location || 'Shenyang')
    const quote = computed(() => props.configdata.hero?.quote || '写点代码，也做些真正想用的东西。')
    const githubUrl = computed(() => {
      const gh = (props.configdata.socialPlatformIcons || []).find(i => (i.icon || '').includes('github'))
      return gh?.link || 'https://github.com'
    })
    const nowPlaying = computed(() => {
      const s = props.currentSong
      return s ? `${s.title || '未知歌曲'} · ${s.author || '未知作者'}` : '—'
    })

    function nav(id) { closeSheet(); emit('navigate', id) }
    function openSheet() { sheetOpen.value = true }
    function closeSheet() { sheetOpen.value = false }
    function act(kind) { closeSheet(); emit(kind) }

    function onKey(e) { if (e.key === 'Escape') closeSheet() }
    onMounted(() => document.addEventListener('keydown', onKey))
    onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

    return {
      sheetOpen, dockIndex, avatar, name, tagline, location, quote, githubUrl, nowPlaying,
      nav, openSheet, closeSheet, act,
    }
  }
}
</script>
