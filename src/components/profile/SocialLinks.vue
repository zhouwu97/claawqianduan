<template>
  <div class="social-row">
    <a class="social" v-for="item in items" :key="item.icon" :href="item.link" target="_blank" rel="noreferrer" :aria-label="item.icon">
      <v-icon size="15">{{ item.icon }}</v-icon>
    </a>
    <button class="social" @click="emit('open-settings')" aria-label="设置">
      <v-icon size="15">mdi-cog</v-icon>
    </button>
    <button class="social" @click="emit('open-about')" aria-label="关于">
      <v-icon size="15">mdi-information-outline</v-icon>
    </button>
  </div>
</template>

<script>
export default {
  props: ['items'],
  emits: ['open-settings', 'open-about'],
  setup(_, { emit }) {
    return { emit }
  }
}
</script>
