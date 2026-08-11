<template>
  <!-- 主作品 -->
  <a v-if="variant === 'showcase'" class="showcase" :href="item.url" target="_blank" rel="noreferrer" @click.prevent="handleClick">
    <div class="showcase-body">
      <div class="showcase-kicker">Featured · {{ item.title.split('·')[0].trim() }}</div>
      <h4>{{ item.title }}</h4>
      <p class="showcase-desc">{{ item.description }}</p>
      <div class="showcase-stack">{{ stack }}</div>
      <div class="showcase-cta">
        View project
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M5 12h14M14 7l5 5-5 5"/></svg>
      </div>
    </div>
    <div class="showcase-visual">
      <img :src="item.img" :alt="item.title" loading="lazy">
    </div>
  </a>

  <!-- 次级横向入口 -->
  <a v-else class="entry" :href="item.url" target="_blank" rel="noreferrer" @click.prevent="handleClick">
    <div class="entry-body">
      <strong>{{ item.title }}</strong>
      <span>{{ item.subtitle }}</span>
    </div>
    <span class="arr">↗</span>
  </a>
</template>

<script>
import { computed } from 'vue'

export default {
  props: ['item', 'variant'],
  emits: ['open-treasure'],
  setup(props, { emit }) {
    const stack = computed(() => {
      if (props.item.tags && props.item.tags.length) return props.item.tags.join(' · ')
      return props.item.subtitle || ''
    })
    function handleClick(e) {
      if (props.item.url === 'treasure') {
        e.preventDefault()
        emit('open-treasure')
      }
    }
    return { stack, handleClick }
  }
}
</script>
