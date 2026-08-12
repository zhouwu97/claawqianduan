<template>
  <section class="hero" :class="{ 'hero-return': returning }">
    <div class="section-index hero-index"><b>01</b> / ABOUT</div>
    <h1 class="hero-title"><span class="hero-title-inner"><span class="accent">{{ heroData.name }}</span>。</span></h1>
    <p class="hero-copy">{{ heroData.intro }}<br>{{ heroData.description }}</p>
    <div class="hero-meta">{{ heroData.tagline }}</div>
    <div class="hero-status">
      <HomeClock :formatted-time="formattedTime" :formatted-date-short="formattedDateShort"
        :status="heroData.status" :quote="heroData.quote" />
    </div>
  </section>
</template>

<script>
import HomeClock from './HomeClock.vue'

export default {
  components: { HomeClock },
  props: {
    heroData: { type: Object, default: () => ({}) },
    formattedTime: { type: String, default: '' },
    formattedDateShort: { type: String, default: '' },
    returning: { type: Boolean, default: false },
  }
}
</script>
