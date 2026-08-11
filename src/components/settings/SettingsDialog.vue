<template>
  <v-dialog :model-value="modelValue" width="1000" height="700" @update:model-value="(v) => emit('update:modelValue', v)">
    <v-card elevation="3" style="backdrop-filter: blur(10px);">
      <v-tabs
        v-model="tabValue"
        :items="tabs"
        align-tabs="center"
        height="60"
        slider-color="var(--leleo-vcard-color)"
      >
        <template v-slot:tab="{ item }">
          <v-tab
            :prepend-icon="item.icon"
            :text="item.text"
            :value="item.value"
            class="text-none"
          ></v-tab>
        </template>

        <template v-slot:item="{ item }">
          <v-tabs-window-item :value="item.value" class="pa-4">
            <AppearanceSettings v-if="item.value=='tab-1'" @cancel="emit('cancel')" />
            <WallpaperSettings v-else-if="item.value=='tab-2'" @cancel="emit('cancel')" />
            <div v-else-if="item.value=='tab-3' && musicinfoLoading" class="loading-spinner" align="center">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
            <MusicSettings
              v-else-if="item.value=='tab-3'"
              :musicinfo="musicinfo"
              :current-index="currentIndex"
              :is-playing="isPlaying"
              :audio-player="audioPlayer"
              :from-lyrics="fromLyrics"
              :audio-loading="audioLoading"
              @update:current-index="(v) => emit('update:current-index', v)"
              @update:is-playing="(v) => emit('update:is-playing', v)"
              @update:current-lyrics="(v) => emit('update:current-lyrics', v)"
            />
          </v-tabs-window-item>
        </template>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
import AppearanceSettings from './AppearanceSettings.vue'
import WallpaperSettings from './WallpaperSettings.vue'
import MusicSettings from './MusicSettings.vue'

export default {
  components: { AppearanceSettings, WallpaperSettings, MusicSettings },
  props: {
    modelValue: Boolean,
    tab: { type: String, default: null },
    musicinfo: Array,
    musicinfoLoading: Boolean,
    currentIndex: Number,
    isPlaying: Boolean,
    audioPlayer: Object,
    fromLyrics: Object,
    audioLoading: Boolean,
  },
  emits: [
    'update:modelValue',
    'update:tab',
    'cancel',
    'update:current-index',
    'update:is-playing',
    'update:current-lyrics',
  ],
  data() {
    return {
      tabs: [
        { icon: 'mdi-pencil-plus', text: '样式预览', value: 'tab-1' },
        { icon: 'mdi-wallpaper', text: '背景预览', value: 'tab-2' },
        { icon: 'mdi-music-circle-outline', text: '音乐播放', value: 'tab-3' },
      ],
    }
  },
  computed: {
    tabValue: {
      get() { return this.tab },
      set(v) { this.$emit('update:tab', v) }
    }
  }
}
</script>
