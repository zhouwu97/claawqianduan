<template>
  <section class="hero">
    <div class="section-index hero-index">01 / ABOUT</div>
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
  props: ['heroData', 'formattedTime', 'formattedDateShort']
}
</script>
