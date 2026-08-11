<template>
  <div class="tags-text">
    <template v-for="(t, i) in tags" :key="t">
      <b>{{ t }}</b><template v-if="i < tags.length - 1"> · </template>
    </template>
  </div>
</template>

<script>
export default {
  props: ['tags']
}
</script>
