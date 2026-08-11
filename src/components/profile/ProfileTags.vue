<template>
  <div class="tags">
    <span class="tag" v-for="t in tags" :key="t">{{ t }}</span>
  </div>
</template>

<script>
export default {
  props: ['tags']
}
</script>
