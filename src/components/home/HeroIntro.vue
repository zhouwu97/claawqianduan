<template>
  <section class="hero">
    <h1 class="hero-title"><span class="accent">{{ heroData.name }}</span>。</h1>
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
