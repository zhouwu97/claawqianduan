<template>
  <div>
    <div class="projects">
      <ProjectCard
        v-for="(item, i) in gridProjects"
        :key="item.id || i"
        :item="item"
        :is-featured="isFeaturedSlot(item, i)"
        :is-wide="isWideSlot(item, i)"
        @click="openCard"
      />
    </div>

    <div v-if="stripProjects.length" class="project-strip">
      <ProjectCard
        v-for="(item, i) in stripProjects"
        :key="'s' + (item.id || i)"
        :item="item"
        @click="openCard"
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
    // 只有"第一张" featured 卡占高位（col1 跨两行）；其余 featured 只是普通卡
    const featuredIndex = computed(() => {
      const idx = props.projects.findIndex(p => p.featured && p.url !== 'treasure')
      return idx >= 0 ? idx : 0
    })

    // 主网格取前 4 个；其余进小条
    const gridProjects = computed(() => props.projects.slice(0, 4))
    const stripProjects = computed(() => props.projects.slice(4))

    function isFeaturedSlot(item, i) {
      if (item.url === 'treasure') return false
      return i === featuredIndex.value
    }
    function isWideSlot(item, i) {
      if (item.url === 'treasure') return false
      if (i === featuredIndex.value) return false
      // 第 4 张卡（index 3）作为 wide；不足 4 张时最后一张非 featured 做 wide
      if (i === 3) return true
      if (gridProjects.value.length < 4) {
        return i === gridProjects.value.length - 1
      }
      return false
    }

    function openCard(item) {
      if (item.url === 'treasure') {
        emit('open-treasure')
      } else if (item.url) {
        window.open(item.url, '_blank')
      }
    }

    return { gridProjects, stripProjects, isFeaturedSlot, isWideSlot, openCard }
  }
}
</script>
