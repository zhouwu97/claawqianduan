<template>
  <v-app class="app-root">
    <transition name="fade">
      <div class="loading" v-show="isloading">
        <loader></loader>
      </div>
    </transition>

    <video v-if="videosrc" autoplay loop muted class="video-bg" id="bg-video" ref="videoEl">
      <source :src="videosrc" type="video/mp4">
    </video>
    <div class="page-bg"></div>
    <div class="noise"></div>

    <div class="floating-switch-container">
      <v-switch
        v-model="isClearScreen"
        inset
        color="var(--color-accent)"
        class="floating-switch"
        @mouseover="expandSwitch"
        @mouseleave="collapseSwitch"
      ></v-switch>
    </div>

    <div class="shell" v-show="!isloading && !isClearScreen">
      <aside class="sidebar">
        <ProfileSidebar
          :configdata="configdata"
          :current-song="currentSong"
          :is-playing="isPlaying"
          @open-settings="dialog1 = true"
          @open-about="dialog2 = true"
          @toggle-play="togglePlay"
          @prev="previousTrack"
          @next="nextTrack"
          @open-music="openMusicSettings"
          @scroll-to="scrollToSection"
        />
      </aside>

      <main class="main">
        <header class="topbar">
          <div class="breadcrumb">
            <span class="mobile-keep">zhouzhou.cc</span><span class="dot-sep"></span><b>Home</b><span>/</span><span>desktop concept</span>
          </div>
          <div class="quick-actions">
            <button class="icon-btn" @click="copyHome" aria-label="复制主页">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
              <span>复制主页</span>
            </button>
            <a class="icon-btn" :href="githubUrl" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 18c-4.5 1.4-4.5-2.5-6-3m12 6v-3.5c0-1 .1-1.5-.5-2 3-.35 6-1.5 6-6.5a5 5 0 0 0-1.35-3.5A4.7 4.7 0 0 0 19 2s-1.05-.35-4 1.35a13.4 13.4 0 0 0-6 0C6.05 1.65 5 2 5 2a4.7 4.7 0 0 0-.15 3.5A5 5 0 0 0 3.5 9c0 5 3 6.15 6 6.5-.5.45-.65 1-.55 2V21"/></svg>
              <span>GitHub</span>
            </a>
          </div>
        </header>

        <div class="content">
          <HeroIntro :hero-data="heroData" :formatted-time="formattedTime" :formatted-date-short="formattedDateShort" @scroll-to="scrollToSection" />

          <div class="search-wrap">
            <SearchBar />
          </div>

          <section id="projects">
            <div class="section-head">
              <div><h3>项目与收藏</h3><p>保留原站内容，但重新做视觉优先级。</p></div>
              <a class="section-link" :href="githubUrl" target="_blank" rel="noreferrer">全部 <span>↗</span></a>
            </div>
            <ProjectShowcase :projects="displayProjects" :configdata="configdata" @open-treasure="treasureOpen = true" />
          </section>

          <section id="skills">
            <div class="section-head">
              <div><h3>技能与近况</h3><p>比雷达图更直接，也更适合桌面端快速扫读。</p></div>
            </div>
            <div class="utility-grid">
              <SkillsOverview :skills="skillList" />
              <CurrentActivity :items="nowItems" />
            </div>
          </section>

          <footer class="footer">
            <div>© {{ year }} <b>{{ siteName }}</b> · {{ siteDomain }}</div>
            <div>Made with less glass, fewer cards, better hierarchy.</div>
          </footer>
        </div>
      </main>
    </div>

    <TreasureDrawer v-model="treasureOpen" :sites="treasureSites" />

    <audio ref="audioEl" @waiting="onWaiting" @canplay="onCanPlay" @ended="nextTrack"></audio>

    <SettingsDialog v-model="dialog1" v-model:tab="tab"
      :musicinfo="musicinfo" :musicinfo-loading="musicinfoLoading"
      :current-index="playlistIndex" :is-playing="isPlaying"
      :audio-player="audioEl" :from-lyrics="lyrics" :audio-loading="audioLoading"
      @update:current-index="updateCurrentIndex"
      @update:is-playing="updateIsPlaying"
      @update:current-lyrics="updateLyrics"
      @cancel="dialog1 = false" />

    <AboutDialog v-model="dialog2" :configdata="configdata" />

    <div class="toast" :class="{ show: toastMsg }">{{ toastMsg }}</div>
  </v-app>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useDisplay } from 'vuetify'
import loader from '../components/loader.vue'
import ProfileSidebar from '../components/profile/ProfileSidebar.vue'
import HeroIntro from '../components/home/HeroIntro.vue'
import SearchBar from '../components/home/SearchBar.vue'
import ProjectShowcase from '../components/home/ProjectShowcase.vue'
import SkillsOverview from '../components/home/SkillsOverview.vue'
import CurrentActivity from '../components/home/CurrentActivity.vue'
import TreasureDrawer from '../components/treasure/TreasureDrawer.vue'
import SettingsDialog from '../components/settings/SettingsDialog.vue'
import AboutDialog from '../components/settings/AboutDialog.vue'
import { useSiteConfig } from '../composables/useSiteConfig.js'
import { useClock } from '../composables/useClock.js'
import { useMusicPlayer } from '../composables/useMusicPlayer.js'
import { useWallpaper } from '../composables/useWallpaper.js'

const { xs } = useDisplay()
const { loadConfig, applyMeta, applyThemeVars } = useSiteConfig()
const { formattedTime, formattedDateShort, start: startClock } = useClock()
const music = useMusicPlayer()
const { videosrc, selectBackground } = useWallpaper()

const configdata = ref(loadConfig())
const isloading = ref(false)
const isClearScreen = ref(false)
const dialog1 = ref(false)
const dialog2 = ref(false)
const tab = ref(null)
const isExpanded = ref(false)
const treasureOpen = ref(false)
const toastMsg = ref('')
const audioEl = ref(null)
const videoEl = ref(null)
let toastTimer = null

const {
  musicinfo, musicinfoLoading, playlistIndex, isPlaying, audioLoading, lyrics, currentSong,
  registerAudio, getMusicInfo, setupAudioListener, togglePlay, previousTrack, nextTrack,
  updateCurrentIndex, updateIsPlaying, updateLyrics, onWaiting, onCanPlay,
} = music

const socialPlatformIcons = computed(() => configdata.value.socialPlatformIcons || [])

/* ---------- 数据归一化（兼容旧 config 字段） ---------- */
const siteName = computed(() => configdata.value.name || '周周')
const siteDomain = computed(() => 'zhouzhou.cc')

const githubUrl = computed(() => {
  const gh = socialPlatformIcons.value.find(i => (i.icon || '').includes('github'))
  return gh?.link || 'https://github.com'
})

const heroData = computed(() => {
  const cfg = configdata.value
  return {
    title: cfg.welcometitle || "Hi, I'm 周周",
    intro: cfg.hero?.intro || '欢迎来到我的小世界。',
    copy: cfg.hero?.description || '写代码、刷题、做项目，也会追番、听歌和收集一些奇奇怪怪的网站。',
    status: cfg.hero?.status || '大概率还没睡',
    quote: cfg.hero?.quote || '生活不止眼前的代码，还有远方的番剧和奶茶。',
    github: githubUrl.value,
  }
})

const nowItems = computed(() => {
  if (configdata.value.now && configdata.value.now.length) return configdata.value.now
  return [
    { icon: 'M8 6h8M6 10h12M6 14h8M6 18h5', title: '沈理校园 SYLUlive', subtitle: '校园应用 · Flutter + Go', status: 'Active' },
    { icon: 'm6 16 4-8 4 8 4-8', title: '算法练习', subtitle: 'NowCoder · AtCoder · Luogu', status: 'Daily' },
  ]
})

const skillList = computed(() => {
  const cfg = configdata.value
  if (cfg.skills?.list?.length) return cfg.skills.list
  const names = cfg.polarChart?.skills || []
  const pts = cfg.polarChart?.skillPoints || []
  return names.slice(0, 6).map((name, i) => ({ name, value: pts[i] ?? 60 }))
})

const treasureSites = computed(() => configdata.value.treasurewebs || [])

const displayProjects = computed(() => {
  const cfg = configdata.value
  if (cfg.projects && cfg.projects.length) return cfg.projects
  return (cfg.projectcards || []).map(c => ({
    id: c.title,
    title: c.title,
    subtitle: c.subtitle,
    description: c.text,
    img: c.img,
    url: c.url,
    featured: false,
    tags: [],
    status: '',
  }))
})

/* ---------- 交互 ---------- */
function scrollToSection(id) {
  const target = id === 'top' ? document.querySelector('.main') : document.getElementById(id)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function showToast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 1600)
}

async function copyHome() {
  try {
    await navigator.clipboard.writeText('https://zhouwu.ccwu.cc')
    showToast('主页地址已复制')
  } catch {
    showToast('https://zhouwu.ccwu.cc')
  }
}

function openMusicSettings() { dialog1.value = true; tab.value = 'tab-3' }
function expandSwitch() { isExpanded.value = true }
function collapseSwitch() { isExpanded.value = false }

const year = new Date().getFullYear()

watch(isClearScreen, (val) => {
  if (!videosrc.value) return
  if (val && videoEl.value) {
    videoEl.value.style.zIndex = 0
    videoEl.value.controls = true
  } else if (videoEl.value) {
    videoEl.value.style.zIndex = -100
    videoEl.value.controls = false
  }
})

onMounted(async () => {
  isloading.value = true
  applyMeta(configdata.value)
  applyThemeVars(configdata.value)
  const imageurl = selectBackground(configdata.value, xs.value)

  const loadImage = () => {
    const imageUrls = [
      configdata.value.avatar,
      ...(configdata.value.projectcards || []).map(item => item.img)
    ]
    return new Promise((resolve) => {
      const imagePromises = imageUrls.map((url) => {
        return new Promise((resolveImg) => {
          const imgs = new Image()
          imgs.src = url
          imgs.onload = () => resolveImg()
          imgs.onerror = () => resolveImg()
        })
      })
      const timeoutPromise = new Promise((resolveTimeout) => {
        setTimeout(() => resolveTimeout(), 2500)
      })
      Promise.race([Promise.all(imagePromises), timeoutPromise]).then(() => {
        if (imageurl) {
          const img = new Image()
          img.src = imageurl
          img.onload = () => resolve()
          img.onerror = () => resolve()
        } else {
          const video = videoEl.value
          if (video) {
            video.onloadedmetadata = () => resolve()
            video.onerror = () => resolve()
          } else {
            resolve()
          }
        }
      })
    })
  }

  loadImage().then(() => {
    startClock()
    setTimeout(() => { isloading.value = false }, 500)
  }).catch(() => {
    console.error('壁纸加载失败')
    setTimeout(() => { isloading.value = false }, 100)
  })

  registerAudio(audioEl.value)
  try {
    await getMusicInfo(configdata.value)
    setupAudioListener()
  } catch (e) {
    console.log('音乐加载失败', e)
  }
})

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
})
</script>
