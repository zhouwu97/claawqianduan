<template>
  <div class="utility" :class="{ 'in-view': active }">
    <div class="utility-head"><strong>技术栈</strong><span>selected skills</span></div>
    <div class="skill-list">
      <div class="skill-row" v-for="(s, i) in skills" :key="s.name">
        <label>{{ s.name }}</label>
        <div class="bar"><i :style="{ '--v': (s.value || 0) / 100, '--d': (i * 70) + 'ms' }"></i></div>
        <b>{{ s.value }}</b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    skills: { type: Array, default: () => [] },
    active: { type: Boolean, default: false },
  }
}
</script>
