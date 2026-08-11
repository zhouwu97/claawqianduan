<template>
  <div class="sidebar-inner">
    <ProfileIdentity :configdata="configdata" />

    <nav class="nav">
      <button class="nav-btn" :class="{ active: activeNav === 'top' }" @click="go('top')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 10.5 12 4l8 6.5V20H8v-6h8v6"/><path d="M4 10.5V20h4"/></svg>
        <span>首页</span>
      </button>
      <button class="nav-btn" :class="{ active: activeNav === 'projects' }" @click="go('projects')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5M8 17h3"/></svg>
        <span>项目与收藏</span>
      </button>
      <button class="nav-btn" :class="{ active: activeNav === 'skills' }" @click="go('skills')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3 4.5 7.2 12 11.4l7.5-4.2L12 3Z"/><path d="m4.5 12 7.5 4.2 7.5-4.2M4.5 16.8 12 21l7.5-4.2"/></svg>
        <span>技能与近况</span>
      </button>
      <a class="nav-btn" :href="githubUrl" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 18c-4.5 1.4-4.5-2.5-6-3m12 6v-3.5c0-1 .1-1.5-.5-2 3-.35 6-1.5 6-6.5a5 5 0 0 0-1.35-3.5A4.7 4.7 0 0 0 19 2s-1.05-.35-4 1.35a13.4 13.4 0 0 0-6 0C6.05 1.65 5 2 5 2a4.7 4.7 0 0 0-.15 3.5A5 5 0 0 0 3.5 9c0 5 3 6.15 6 6.5-.5.45-.65 1-.55 2V21"/></svg>
        <span>GitHub</span>
      </a>
    </nav>

    <div class="sidebar-section">
      <div class="section-label">About me</div>
      <ProfileTags :tags="tags" />
    </div>

    <div class="sidebar-bottom">
      <MusicDock :current-song="currentSong" :is-playing="isPlaying"
        @toggle-play="emit('toggle-play')" @prev="emit('prev')" @next="emit('next')"
        @open-music="emit('open-music')" />
      <SocialLinks :items="socials" @open-settings="emit('open-settings')" @open-about="emit('open-about')" />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import ProfileIdentity from './ProfileIdentity.vue'
import ProfileTags from './ProfileTags.vue'
import SocialLinks from './SocialLinks.vue'
import MusicDock from './MusicDock.vue'

export default {
  components: { ProfileIdentity, ProfileTags, SocialLinks, MusicDock },
  props: ['configdata', 'currentSong', 'isPlaying'],
  emits: ['open-settings', 'open-about', 'toggle-play', 'prev', 'next', 'open-music', 'scroll-to'],
  setup(props, { emit }) {
    const activeNav = ref('top')

    const name = computed(() => props.configdata.name || '周周')
    const location = computed(() => props.configdata.hero?.location || 'Shenyang')
    const tags = computed(() => (props.configdata.tags || []).slice(0, 5))
    const socials = computed(() => props.configdata.socialPlatformIcons || [])
    const githubUrl = computed(() => {
      const gh = (props.configdata.socialPlatformIcons || []).find(i => (i.icon || '').includes('github'))
      return gh?.link || 'https://github.com'
    })

    function go(id) {
      activeNav.value = id
      emit('scroll-to', id)
    }

    return { emit, activeNav, name, location, tags, socials, githubUrl, go }
  }
}
</script>
