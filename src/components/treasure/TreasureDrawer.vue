<template>
  <div>
    <v-navigation-drawer
      v-if="!isXs"
      :model-value="modelValue"
      @update:model-value="(v) => emit('update:modelValue', v)"
      location="right"
      temporary
      width="400"
      class="treasure-drawer"
    >
      <div class="treasure-head">
        <h3>宝藏网站</h3>
        <button class="close" @click="emit('update:modelValue', false)" aria-label="关闭">×</button>
      </div>
      <div class="treasure-list">
        <a class="treasure-item" v-for="site in sites" :key="site.name" :href="site.url" target="_blank" rel="noreferrer">
          <span class="treasure-item-icon" :style="{ color: site.color }">
            <v-icon size="18">{{ site.icon }}</v-icon>
          </span>
          <div class="treasure-item-info">
            <strong>{{ site.name }}</strong>
            <span>{{ site.desc }}</span>
          </div>
          <span class="treasure-item-arrow">↗</span>
        </a>
      </div>
    </v-navigation-drawer>

    <v-bottom-sheet v-else :model-value="modelValue" @update:model-value="(v) => emit('update:modelValue', v)">
      <div class="treasure-sheet">
        <div class="treasure-head">
          <h3>宝藏网站</h3>
          <button class="close" @click="emit('update:modelValue', false)" aria-label="关闭">×</button>
        </div>
        <div class="treasure-list">
          <a class="treasure-item" v-for="site in sites" :key="site.name" :href="site.url" target="_blank" rel="noreferrer">
            <span class="treasure-item-icon" :style="{ color: site.color }">
              <v-icon size="18">{{ site.icon }}</v-icon>
            </span>
            <div class="treasure-item-info">
              <strong>{{ site.name }}</strong>
              <span>{{ site.desc }}</span>
            </div>
            <span class="treasure-item-arrow">↗</span>
          </a>
        </div>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { useDisplay } from 'vuetify'

export default {
  props: ['modelValue', 'sites'],
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const { xs } = useDisplay()
    return { isXs: xs, emit }
  }
}
</script>

<style scoped>
.treasure-drawer {
  background: var(--color-surface-strong) !important;
  border-left: 1px solid var(--border-line) !important;
}
.treasure-sheet {
  background: var(--color-surface-strong);
  padding: 8px 6px 20px;
  border-radius: 24px 24px 0 0;
}
.treasure-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid var(--border-line);
}
.treasure-head h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 690;
  letter-spacing: -0.02em;
}
.treasure-head .close {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.06);
  color: #9a9aa4;
  font-size: 16px;
  display: grid;
  place-items: center;
  transition:
    background-color var(--duration-ui) ease,
    color var(--duration-ui) ease,
    transform var(--duration-fast) var(--ease-out);
}
.treasure-head .close:hover {
  background: rgba(255, 255, 255, 0.11);
  color: #fff;
}
.treasure-head .close:active {
  transform: scale(0.94);
}
.treasure-list {
  padding: 8px 22px 20px;
}
.treasure-item {
  display: grid;
  grid-template-columns: 38px 1fr auto;
  align-items: center;
  gap: 13px;
  padding: 13px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  transition: background-color var(--duration-ui) ease;
  border-radius: 10px;
}
.treasure-item:last-child {
  border-bottom: 0;
}
.treasure-item:hover {
  background: rgba(255, 255, 255, 0.04);
}
.treasure-item-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.055);
  display: grid;
  place-items: center;
}
.treasure-item-info {
  min-width: 0;
}
.treasure-item-info strong {
  display: block;
  font-size: 12.5px;
  font-weight: 620;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.treasure-item-info span {
  display: block;
  font-size: 10px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.treasure-item-arrow {
  color: #777781;
  font-size: 14px;
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity var(--duration-ui) ease,
    transform var(--duration-ui) var(--ease-out),
    color var(--duration-ui) ease;
}
.treasure-item:hover .treasure-item-arrow {
  opacity: 1;
  transform: none;
  color: var(--color-accent);
}
</style>
