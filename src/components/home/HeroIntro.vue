<template>
  <section class="hero">
    <div>
      <div class="kicker">Personal space · Code, anime &amp; a little pink.</div>
      <h1>
        Hi, I'm <span class="accent">{{ heroName }}</span><br>{{ heroData.intro }}
      </h1>
      <p class="hero-copy">{{ heroData.copy }}</p>
      <div class="hero-actions">
        <a class="primary" :href="heroData.github" target="_blank" rel="noreferrer">
          查看 GitHub
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M5 12h14M14 7l5 5-5 5"/></svg>
        </a>
        <button class="ghost" @click="emit('scroll-to', 'projects')">
          看看我的收藏
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m7 10 5 5 5-5"/></svg>
        </button>
      </div>
    </div>
    <div class="hero-side">
      <HomeClock :formatted-time="formattedTime" :formatted-date-short="formattedDateShort"
        :status="heroData.status" :quote="heroData.quote" />
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import HomeClock from './HomeClock.vue'

export default {
  components: { HomeClock },
  props: ['heroData', 'formattedTime', 'formattedDateShort'],
  emits: ['scroll-to'],
  setup(props, { emit }) {
    const heroName = computed(() => {
      const m = /Hi, I'm (.+)$/.exec(props.heroData.title || '')
      return m ? m[1] : '周周'
    })
    return { emit, heroName }
  }
}
</script>
