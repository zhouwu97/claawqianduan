<template>
  <div class="utility">
    <div class="utility-head"><strong>技术栈</strong><span>selected skills</span></div>
    <div class="skill-list">
      <div class="skill-row" v-for="s in skills" :key="s.name">
        <label>{{ s.name }}</label>
        <div class="bar"><i :style="{ width: s.value + '%' }"></i></div>
        <b>{{ s.value }}</b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['skills']
}
</script>
