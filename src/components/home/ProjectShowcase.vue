<template>
  <div class="projects-v3">
    <ProjectCard
      v-if="mainProject"
      :item="mainProject"
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
import { computed } from 'vue'
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

    return { emit, mainProject, entryProjects }
  }
}
</script>
