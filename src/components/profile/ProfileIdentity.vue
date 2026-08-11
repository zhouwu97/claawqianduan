<template>
  <div class="identity">
    <div class="avatar-wrap">
      <img class="avatar" :src="configdata.avatar" alt="周周头像">
    </div>
    <div>
      <h2>{{ name }} <span style="color: var(--color-accent);">.</span></h2>
      <p><span class="live-dot"></span>online · {{ location }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: ['configdata'],
  setup(props) {
    const name = computed(() => props.configdata.name || '周周')
    const location = computed(() => props.configdata.hero?.location || 'Shenyang')
    return { name, location }
  }
}
</script>
