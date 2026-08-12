<template>
  <v-app class="app-root">
    <transition name="fade" @after-leave="startIntro">
      <div class="loading" v-show="isloading">
        <loader></loader>
      </div>
    </transition>

    <video v-if="videosrc" autoplay loop muted class="video-bg" id="bg-video" ref="videoEl">
      <source :src="videosrc" type="video/mp4">
    </video>
    <div class="page-bg" :class="{ intro: introActive, 'clear-mode': isClearScreen }"></div>
    <div class="noise"></div>
    <div class="scene-sweep" ref="sweepEl"></div>

    <Transition name="clear">
      <div v-show="!isloading && !isClearScreen" class="layout" :class="{ intro: introActive }">
      <aside class="rail">
        <ProfileSidebar
          :configdata="configdata"
          :current-song="currentSong"
          :is-playing="isPlaying"
          :active-nav="activeNav"
          @open-settings="dialog1 = true"
          @open-about="dialog2 = true"
          @toggle-play="togglePlay"
          @prev="previousTrack"
          @next="nextTrack"
          @open-music="openMusicSettings"
          @scroll-to="scrollToSection"
          @clear-screen="isClearScreen = !isClearScreen"
        />
      </aside>

      <main class="main-area" ref="mainEl">
        <div class="content">
          <HeroIntro :hero-data="heroData" :formatted-time="formattedTime" :formatted-date-short="formattedDateShort" :returning="heroReturning" />

          <div class="search-wrap">
            <SearchBar />
          </div>

          <section id="projects" class="section">
            <div class="scene-number">02</div>
            <div class="section-head">
              <div class="scene-line">
                <div>
                  <div class="section-index"><b>02</b> / PROJECT</div>
                  <h3>项目</h3>
                  <p>在做的东西，和常去的地方。</p>
                </div>
              </div>
            </div>
            <ProjectShowcase :projects="displayProjects" :configdata="configdata" :active="reveal.state.projects" @open-treasure="treasureOpen = true" />
          </section>

          <section id="skills" class="section">
            <div class="scene-number">03</div>
            <div class="section-head">
              <div class="scene-line">
                <div>
                  <div class="section-index"><b>03</b> / NOW</div>
                  <h3>技能与近况</h3>
                  <p>常用技术栈，和最近在做的事。</p>
                </div>
              </div>
            </div>
            <div class="utility-grid">
              <SkillsOverview :skills="skillList" :active="reveal.state.now" />
              <CurrentActivity :items="nowItems" :active="reveal.state.now" />
            </div>
          </section>

          <footer class="footer">
            <div>© {{ year }} <b>{{ siteName }}</b> · {{ siteDomain }}</div>
            <div>写代码，也写点生活。</div>
          </footer>
        </div>
      </main>
      </div>
    </Transition>

    <MobileNav
      v-show="!isClearScreen"
      :active="activeNav"
      :configdata="configdata"
      :current-song="currentSong"
      @navigate="scrollToSection"
      @open-about="dialog2 = true"
      @open-settings="openMusicSettings"
      @clear-screen="isClearScreen = !isClearScreen"
    />

    <TreasureDrawer v-model="treasureOpen" :sites="treasureSites" />

    <Transition name="clear-restore">
      <button v-if="isClearScreen" class="clear-restore" @click="isClearScreen = false">
        返回主页
      </button>
    </Transition>

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
import MobileNav from '../components/home/MobileNav.vue'
import TreasureDrawer from '../components/treasure/TreasureDrawer.vue'
import SettingsDialog from '../components/settings/SettingsDialog.vue'
import AboutDialog from '../components/settings/AboutDialog.vue'
import { useSiteConfig } from '../composables/useSiteConfig.js'
import { useClock } from '../composables/useClock.js'
import { useMusicPlayer } from '../composables/useMusicPlayer.js'
import { useWallpaper } from '../composables/useWallpaper.js'
import { useScrollReveal } from '../composables/useScrollReveal.js'
import { useScrollSpy } from '../composables/useScrollSpy.js'

const { xs, width } = useDisplay()
const { loadConfig, applyMeta, applyThemeVars } = useSiteConfig()
const { formattedTime, formattedDateShort, start: startClock } = useClock()
const music = useMusicPlayer()
const { videosrc, selectBackground } = useWallpaper()

const configdata = ref(loadConfig())
// loader 首帧即显示，禁止 layout 闪现后再盖 loader（FOUC）
const isloading = ref(true)
const isClearScreen = ref(false)
const dialog1 = ref(false)
const dialog2 = ref(false)
const tab = ref(null)
const treasureOpen = ref(false)
const audioEl = ref(null)
const videoEl = ref(null)
const mainEl = ref(null)
const sweepEl = ref(null)
/* 持久 visited 与运行时 introActive 分离：
   - hasVisited：会话内是否看过（不直接当动画状态）
   - introActive：cinematic intro 实时开关，动画播完即关
   - 清屏恢复 / 刷新都不会重播 */
const hasVisited = sessionStorage.getItem('zhouzhou-visited') === '1'
const introActive = ref(false)
let introTimer = null

function startIntro() {
  if (hasVisited) return
  introActive.value = true
  sessionStorage.setItem('zhouzhou-visited', '1')
  clearTimeout(introTimer)
  // 最长动画 = search 340ms 延迟 + 420ms 时长，留余量
  introTimer = setTimeout(() => { introActive.value = false }, 900)
}

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
    name: cfg.name || '周周',
    title: cfg.welcometitle || "Hi, I'm 周周",
    intro: cfg.hero?.intro || '写点代码，也做些真正想用的东西。',
    description: cfg.hero?.description || '最近主要折腾沈理校园、算法，还有一些乱七八糟的小项目。',
    tagline: cfg.hero?.tagline || '沈阳理工大学 · 计算机 / 开发 / 二次元',
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

/* ---------- Motion：统一可重播 Reveal + ScrollSpy ----------
   滚动容器：桌面为 .main-area（内部滚动），移动端为 viewport（body 滚动） */
const isMobileLayout = computed(() => width.value <= 767)
const reveal = useScrollReveal({
  enterThreshold: isMobileLayout.value ? 0.22 : 0.28,
  leaveOffset: isMobileLayout.value ? 0.03 : 0.04,
})
const spy = useScrollSpy()
/* 顶层 ref：模板自动解包（嵌套对象里的 ref 不会解包） */
const activeNav = spy.active
let scroller = null

const heroReturning = ref(false)
let heroReturnTimer = null
let heroHasLeft = false
const HERO_LEAVE = 260
const HERO_BACK = 80

/* 背景二层 scroll parallax：仅桌面内部滚动容器，rAF 节流
   prefers-reduced-motion 下禁用 */
const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
let parallaxRaf = 0

function onAnyScroll() {
  // 背景 parallax：只对内部滚动容器生效（桌面），避免移动端 body 滚动带动背景
  if (!prefersReduced && scroller) {
    cancelAnimationFrame(parallaxRaf)
    parallaxRaf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--bg-parallax', `${Math.round(scroller.scrollTop * -0.15)}px`)
    })
  }
  // Hero Return：滚过 hero 再回来 → 轻量动画（不重播幕布）
  const y = scroller ? scroller.scrollTop : (window.scrollY || 0)
  if (y > HERO_LEAVE && !heroHasLeft) {
    heroHasLeft = true
  } else if (y <= HERO_BACK && heroHasLeft) {
    heroHasLeft = false
    heroReturning.value = true
    clearTimeout(heroReturnTimer)
    heroReturnTimer = setTimeout(() => { heroReturning.value = false }, 700)
  }
}

/* 导航点击 Scene Sweep：0ms 扫线 → 60ms 滚动 → 620ms 扫完 */
function playSweep(target) {
  if (prefersReduced || !sweepEl.value || isMobileLayout.value) return
  if (!target) return
  const r = target.getBoundingClientRect()
  sweepEl.value.style.setProperty('--sweep-y', `${Math.max(80, Math.min(window.innerHeight - 80, r.top + 42))}px`)
  sweepEl.value.classList.remove('play')
  void sweepEl.value.offsetWidth
  sweepEl.value.classList.add('play')
}

function scrollToSection(id) {
  spy.setActive(id === 'top' ? 'top' : id)
  const target = id === 'top' ? null : document.getElementById(id)
  playSweep(target)
  // 桌面：.main-area 内部滚动；移动端：body 滚动（-76 让 section 顶部让开顶部胶囊）
  setTimeout(() => {
    if (!scroller) {
      if (id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' })
      }
      return
    }
    if (id === 'top') {
      scroller.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (!target) return
    const mainRect = scroller.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    scroller.scrollTo({
      top: scroller.scrollTop + targetRect.top - mainRect.top,
      behavior: 'smooth'
    })
  }, 60)
}

function openMusicSettings() { dialog1.value = true; tab.value = 'tab-3' }

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
  applyMeta(configdata.value)
  applyThemeVars(configdata.value)
  const imageurl = selectBackground(configdata.value, xs.value)

  // 滚动模型：桌面 = .main-area 内部滚动；移动端 = body 滚动（viewport）
  // 注意：不能用 scrollHeight 探测——onMounted 时 layout 仍 display:none，两者都是 0
  scroller = width.value > 767 ? mainEl.value : null

  reveal.start(scroller)
  spy.start(scroller)
  const projectsEl = document.getElementById('projects')
  const skillsEl = document.getElementById('skills')
  // 兄弟相对 reset：A 离开 enter 区且 B 已进入 → A 重置（任何内容高度下都可达）
  if (projectsEl) reveal.register(projectsEl, 'projects', { resetBy: skillsEl })
  if (skillsEl) reveal.register(skillsEl, 'now', { resetBy: projectsEl })
  ;(scroller || window).addEventListener('scroll', onAnyScroll, { passive: true })

  const loadImage = () => {
    // 预载真正展示的项目图（新 projects 结构，兼容旧字段）
    const imageUrls = [
      configdata.value.avatar,
      ...displayProjects.value.map(item => item.img).filter(Boolean)
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
  clearTimeout(introTimer)
  clearTimeout(heroReturnTimer)
  cancelAnimationFrame(parallaxRaf)
  ;(scroller || window).removeEventListener('scroll', onAnyScroll)
})
</script>
