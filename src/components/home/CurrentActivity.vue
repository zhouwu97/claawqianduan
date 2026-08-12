<template>
  <div class="utility" :class="{ 'in-view': active }">
    <div class="utility-head"><strong>最近在做</strong><span>now</span></div>
    <div class="now" v-for="(item, i) in items" :key="i" :style="{ '--d': (120 + i * 70) + 'ms' }">
      <div class="now-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path :d="item.icon"/></svg>
      </div>
      <div>
        <strong>{{ item.title }}</strong>
        <span>{{ item.subtitle }}</span>
      </div>
      <em>{{ item.status }}</em>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
    active: { type: Boolean, default: false },
  }
}
</script>
