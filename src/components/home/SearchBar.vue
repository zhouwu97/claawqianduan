<template>
  <div class="search">
    <v-menu v-model="engineMenu" location="bottom start" :offset="[0, 10]">
      <template v-slot:activator="{ props }">
        <button class="engine" v-bind="props" aria-label="选择搜索引擎">
          {{ selectedEngine.title }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 10 5 5 5-5"/></svg>
        </button>
      </template>
      <v-list class="engine-menu" density="compact">
        <v-list-item v-for="engine in searchEngines" :key="engine.value" @click="selectedEngine = engine" density="compact">
          {{ engine.title }}
        </v-list-item>
      </v-list>
    </v-menu>

    <input
      v-model="searchQuery"
      autocomplete="off"
      placeholder="搜索，或者直接输入一个网址…"
      @keydown.enter="performSearch"
    />

    <button class="search-submit" @click="performSearch" :aria-label="isUrl ? '打开网址' : '搜索'">
      <svg v-if="isUrl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z"/></svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useSearch } from '../../composables/useSearch.js'

export default {
  setup() {
    const engineMenu = ref(false)
    const { searchQuery, selectedEngine, searchEngines, isUrl, performSearch } = useSearch()
    return { engineMenu, searchQuery, selectedEngine, searchEngines, isUrl, performSearch }
  }
}
</script>
