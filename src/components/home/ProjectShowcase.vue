<template>
  <div class="projects-v3" ref="projEl" :class="{ 'is-revealed': revealed }">
    <ProjectCard
      v-if="mainProject"
      :item="mainProject"
      :revealed="revealed"
      variant="showcase"
      @open-treasure="emit('open-treasure')"
    />

    <div class="projects-links">
      <ProjectCard
        v-for="(item, i) in entryProjects"
        :key="item.id || 'e' + i"
        :item="item"
        variant="entry"
        @open-treasure="emit('open-treasure')"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ProjectCard from './ProjectCard.vue'

export default {
  components: { ProjectCard },
  props: ['projects', 'configdata'],
  emits: ['open-treasure'],
  setup(props, { emit }) {
    // 主作品 = 第一个 featured 且非 treasure；没有则取第一个非 treasure
    const mainProject = computed(() => {
      const list = props.projects || []
      return (
        list.find(p => p.featured && p.url !== 'treasure') ||
        list.find(p => p.url !== 'treasure') ||
        null
      )
    })

    // 其余全部进横向入口（最多 3 个）
    const entryProjects = computed(() => {
      const list = props.projects || []
      return list.filter(p => p !== mainProject.value).slice(0, 3)
    })

    /* 主作品首次进入 viewport 的 reveal：只播放一次，永久 settle */
    const projEl = ref(null)
    const revealed = ref(false)
    let io = null

    onMounted(() => {
      if (!('IntersectionObserver' in window)) {
        revealed.value = true
        return
      }
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealed.value = true
            io && io.disconnect()
          }
        })
      }, { threshold: 0.25 })
      if (projEl.value) io.observe(projEl.value)
    })

    onBeforeUnmount(() => {
      if (io) io.disconnect()
    })

    return { emit, mainProject, entryProjects, projEl, revealed }
  }
}
</script>
