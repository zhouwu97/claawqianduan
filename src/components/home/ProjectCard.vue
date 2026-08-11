<template>
  <a class="project" :class="{ featured: isFeatured, wide: isWide }" @click.prevent="emit('click', item)">
    <img :src="item.img" :alt="item.title" loading="lazy">
    <div v-if="badge" class="feature-badge">{{ badge }}</div>
    <div class="project-info">
      <div class="project-title">
        <strong>{{ item.title }}</strong>
        <span>{{ item.subtitle }}</span>
      </div>
      <div class="project-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M7 17 17 7M8 7h9v9"/></svg>
      </div>
    </div>
  </a>
</template>

<script>
import { computed } from 'vue'

export default {
  props: ['item', 'isFeatured', 'isWide'],
  emits: ['click'],
  setup(props, { emit }) {
    const badge = computed(() => {
      if (props.item.status) return props.item.status
      if (props.isFeatured) return 'Pinned'
      return ''
    })
    return { emit, badge }
  }
}
</script>
