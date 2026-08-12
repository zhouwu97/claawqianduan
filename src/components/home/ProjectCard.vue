<template>
  <!-- 主作品：editorial 排版 -->
  <a v-if="variant === 'showcase'" class="showcase" :class="{ 'in-view': active }" :href="item.url" target="_blank" rel="noreferrer" @click="handleClick">
    <div class="showcase-body">
      <div class="kicker" v-if="showKicker">{{ showKicker }}</div>
      <h4><span v-for="(line, i) in titleLines" :key="i">{{ line }}<br v-if="i < titleLines.length - 1"></span></h4>
      <p class="showcase-desc">{{ item.description }}</p>
      <ul class="showcase-stack">
        <li v-for="t in stackTags" :key="t">{{ t }}</li>
      </ul>
      <div class="showcase-cta">
        查看项目
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M5 12h14M14 7l5 5-5 5"/></svg>
      </div>
    </div>
    <div class="showcase-visual">
      <img :src="item.img" :alt="item.title" loading="lazy">
    </div>
  </a>

  <!-- 次级横向入口 -->
  <a v-else class="entry" :href="item.url" target="_blank" rel="noreferrer" @click="handleClick">
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
  props: {
    item: { type: Object, required: true },
    variant: { type: String, default: 'entry' },
    active: { type: Boolean, default: false },
  },
  emits: ['open-treasure'],
  setup(props, { emit }) {
    // 两行标题："沈理校园 · SYLUlive" → ["沈理校园", "SYLUlive"]
    const titleLines = computed(() =>
      (props.item.title || '').split('·').map(s => s.trim()).filter(Boolean)
    )
    // 技术栈：优先 tags，回退 subtitle
    const stackTags = computed(() => {
      if (props.item.tags && props.item.tags.length) return props.item.tags
      return (props.item.subtitle || '').split('·').map(s => s.trim()).filter(Boolean)
    })
    // kicker：有 status 徽标的主作品显示固定文案；也可用字段覆盖
    const showKicker = computed(() =>
      props.item.kicker || (props.item.status ? 'CURRENTLY BUILDING' : '')
    )
    function handleClick(e) {
      if (props.item.url === 'treasure') {
        e.preventDefault()
        emit('open-treasure')
      }
    }
    return { titleLines, stackTags, showKicker, handleClick }
  }
}
</script>
