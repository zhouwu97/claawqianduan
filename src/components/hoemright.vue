<template>
  <div>
    <div>
      <div :style="xs||sm?{'display':'none'}:{'font-size':'4rem'}" class="leleo-left-welcome">{{ configdata.welcometitle }}</div>
    </div>
    <div>
      <v-row align="center">
        <v-col cols="12" md="8">
          <v-text-field class="v-card"
            :style="xs||sm?{'display':'none'}:{}"
            v-model="searchQuery"
            placeholder="搜索..."
            variant="outlined"
            rounded
            hide-details="true"
            @keyup.enter="performSearch"
          >
            <template v-slot:prepend-inner>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" v-bind="props" class="engine-btn">
                    {{ selectedEngine.title }}
                    <v-icon icon="mdi-chevron-down"></v-icon>
                  </v-btn>
                </template>
                <v-list class="glass-list">
                  <v-list-item v-for="engine in searchEngines" :key="engine.value" @click="selectedEngine = engine" density="compact">
                    {{ engine.title }}
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template v-slot:append-inner>
              <v-btn :icon="isUrl ? 'mdi-earth' : 'mdi-magnify'" variant="text" @click="performSearch"></v-btn>
            </template>
          </v-text-field>
          <typewriter class="ma-3 d-flex align-center justify-center" style="min-height: 200px;"></typewriter>
        </v-col>
        <v-col cols="12" md="4" align="center">
          <v-card class="ma-3" hover>
            <template v-slot:title>
              <span class="leleo-card-title clock-font">{{formattedTime}}</span>
            </template>
            <template v-slot:subtitle>
              <span style="font-weight: bold;">{{formattedDate}}</span>
            </template>
            <turntable :color1="configdata.color.turntablecolor1" :color2="configdata.color.turntablecolor2" />
          </v-card>
        </v-col>
      </v-row>

      <v-chip class="mt-3 ml-3" prepend-icon="mdi-webhook" size="large" style="color: var(--leleo-vcard-color);">部署项目</v-chip>
      <v-container>
        <v-row>
<v-col v-for="(item,key) in projectcards" cols="6" md="4" lg="3" :style="xs?{'padding': '6px'}:{}">
            <v-card class="project-card" @click="openCardDialog(item)">
              <v-img class="project-img" aspect-ratio="1.7778" :src="item.img" cover :style="{ opacity: 0.8 }" loading="lazy"></v-img>
              <v-card-title :style="xs?{'font-size': '0.9rem','padding': '0.15rem 0.5rem'}:{'font-size': '1.1rem','padding':'0.2rem 0.8rem'}">{{item.title}}</v-card-title>
              <v-card-subtitle :style="xs?{'font-size': '0.6rem','padding': '0.1rem 0.5rem'}:{'font-size': '0.8rem','padding': '0.15rem 0.6rem'}">{{ item.subtitle }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-dialog v-model="cardDialog" max-width="800" scrollable>
      <v-card v-if="selectedCard?.url === 'treasure'" class="treasure-dialog-card" rounded="xl">
        <div class="treasure-header">
          <div class="treasure-header-bg"></div>
          <div class="treasure-header-content">
            <v-icon size="50" color="white">mdi-treasure-chest</v-icon>
            <h2 class="treasure-title">宝藏网站</h2>
            <p class="treasure-subtitle">发现互联网上的宝藏资源</p>
          </div>
        </div>

        <v-card-text class="treasure-content pa-5">
          <v-row>
            <v-col v-for="(site, index) in configdata.treasurewebs" :key="index" cols="12" sm="6">
              <v-card
                class="treasure-site-card"
                :style="{ '--site-color': site.color }"
                variant="tonal"
                rounded="lg"
                @click="openTreasureSite(site.url)"
              >
                <div class="treasure-site-icon-wrap">
                  <v-icon :color="site.color" size="28">{{ site.icon }}</v-icon>
                </div>
                <div class="treasure-site-info">
                  <h4 class="treasure-site-name">{{ site.name }}</h4>
                  <p class="treasure-site-desc">{{ site.desc }}</p>
                </div>
                <v-icon class="treasure-site-arrow" size="20">mdi-arrow-right</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="cardDialog = false" class="treasure-close-btn">
            <v-icon class="mr-1">mdi-close</v-icon>
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-else class="card-dialog-card" rounded="xl">
        <v-img
          v-if="selectedCard?.img"
          :src="selectedCard.img"
          height="180"
          cover
          class="card-dialog-img"
        >
          <div class="card-dialog-img-overlay">
            <v-icon size="40" color="white">mdi-star-circle</v-icon>
          </div>
        </v-img>
        <v-card-title class="card-dialog-title pt-4 pb-0">
          <v-icon class="mr-2" :color="configdata.color.themecolor">{{ getCardIcon(selectedCard?.title) }}</v-icon>
          {{ selectedCard?.title }}
        </v-card-title>
        <v-card-subtitle class="pt-1 pb-2">{{ selectedCard?.subtitle }}</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <p class="text-body-1 mb-4 card-dialog-desc">{{ selectedCard?.text }}</p>
          <div class="card-dialog-url-section">
            <div class="card-dialog-url-label mb-2">
              <v-icon size="16" class="mr-1">mdi-link-variant</v-icon>
              链接地址
            </div>
            <div class="d-flex align-center gap-2">
              <v-text-field
                v-model="selectedCardUrl"
                readonly
                dense
                variant="outlined"
                hide-details
                class="card-dialog-url-input"
                bg-color="grey-lighten-4"
              ></v-text-field>
              <v-btn
                icon
                variant="tonal"
                color="primary"
                @click="copyUrl"
                class="card-dialog-action-btn"
              >
                <v-icon>mdi-content-copy</v-icon>
                <v-tooltip activator="parent" location="top">复制链接</v-tooltip>
              </v-btn>
              <v-btn
                icon
                variant="flat"
                color="primary"
                :href="selectedCard?.url"
                target="_blank"
                class="card-dialog-action-btn"
              >
                <v-icon>mdi-open-in-new</v-icon>
                <v-tooltip activator="parent" location="top">前往</v-tooltip>
              </v-btn>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-2">
          <v-spacer></v-spacer>
          <v-btn
            variant="tonal"
            @click="cardDialog = false"
            class="card-dialog-close-btn"
          >
            <v-icon class="mr-1">mdi-close</v-icon>
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import typewriter from '../components/typewriter.vue';
import turntable from '../components/turntable.vue';
import { useDisplay } from 'vuetify'

export default {
  components: { typewriter, turntable },
  props: ['configdata','formattedTime','formattedDate','projectcards'],
  data() {
    return {
      searchQuery: '',
      selectedEngine: { title: 'Bing', value: 'bing' },
      searchEngines: [
        { title: 'Bing', value: 'bing' },
        { title: 'Google', value: 'google' },
        { title: '百度', value: 'baidu' },
        { title: 'Yandex', value: 'yandex' },
        { title: 'DuckDuckGo', value: 'duckduckgo' },
      ],
      cardDialog: false,
      selectedCard: null,
      selectedCardUrl: '',
    }
  },
  setup() {
    const { xs, sm, md } = useDisplay();
    return { xs, sm, md };
  },
  computed: {
    isUrl(){
      const str = this.searchQuery.trim();
      return this.isLikelyUrl(str);
    }
  },
  methods: {
    openCardDialog(item) {
      // 宝藏网站保留弹窗，其他直接跳转
      if (item.url === 'treasure') {
        this.selectedCard = item;
        this.selectedCardUrl = item.url;
        this.cardDialog = true;
      } else {
        window.open(item.url, '_blank');
      }
    },
    copyUrl() {
      navigator.clipboard.writeText(this.selectedCardUrl);
    },
    projectcardsShow(key){
      for(let i = 0;i < this.projectcards.length;i++){
        if(i != key){
          this.projectcards[i].show = false;
        }
      }
    },
    performSearch() {
      const query = this.searchQuery.trim();
      if (!query) return;
      if (this.isUrl) {
        let url = query;
        if (!/^[a-z]+:\/\//i.test(url)) {
          url = 'http://' + url;
        }
        window.open(url, '_blank');
      } else {
        const engineUrls = {
          google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
          baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
          yandex: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
          duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
        };
        window.open(engineUrls[this.selectedEngine.value], '_blank');
      }
    },
    isLikelyUrl(input) {
      const str = input.trim();
      if (/^(https?|ftp):\/\//i.test(str)) return true;
      const domainPattern = /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
      const localPattern = /^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/.*)?$/i;
      return domainPattern.test(str) || localPattern.test(str);
    },
    getCardIcon(title) {
      const iconMap = {
        '洛谷': 'mdi-sword',
        '宝藏网站': 'mdi-treasure-chest',
        '歌单分享': 'mdi-music-note',
        '游戏记录': 'mdi-gamepad-variant',
        '赛博要饭': 'mdi-hand-coin',
      };
      return iconMap[title] || 'mdi-star';
    },
    openTreasureSite(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped>
.glass-list {
  background: transparent !important;
  backdrop-filter: blur(var(--leleo-blur));
  border-radius: 5%;
  color: var(--leleo-vcard-color);
  overflow: hidden;
}
.project-card {
  transition: transform 0.3s ease;
}
.project-card:hover {
  transform: scale(1.05);
}
.project-img {
  transition: transform 0.3s ease;
}
.project-img:hover {
  transform: scale(1.05);
}
.card-dialog-card {
  overflow: hidden;
  background: linear-gradient(135deg, #fdf6f9 0%, #fff5f8 100%);
}
.card-dialog-img {
  position: relative;
}
.card-dialog-img-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255,137,181,0.6) 0%, rgba(221,160,221,0.6) 100%);
  backdrop-filter: blur(2px);
}
.card-dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}
.card-dialog-desc {
  color: #666;
  line-height: 1.6;
}
.card-dialog-url-section {
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255,137,181,0.2);
}
.card-dialog-url-label {
  font-size: 0.85rem;
  color: #888;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.card-dialog-url-input :deep(input) {
  font-size: 0.9rem;
}
.card-dialog-action-btn {
  flex-shrink: 0;
}
.card-dialog-close-btn {
  color: #999;
}
.treasure-dialog-card {
  overflow: hidden;
  background: linear-gradient(135deg, #fdf6f9 0%, #fff5f8 100%);
}
.treasure-header {
  position: relative;
  height: 160px;
  overflow: hidden;
}
.treasure-header-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #FF89B5 0%, #DDA0DD 50%, #FFB6C1 100%);
}
.treasure-header-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
}
.treasure-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 10px 0 5px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}
.treasure-subtitle {
  font-size: 1rem;
  color: rgba(255,255,255,0.9);
  margin: 0;
}
.treasure-content {
  background: white;
}
.treasure-site-card {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid var(--site-color);
  margin-bottom: 12px;
}
.treasure-site-card:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.treasure-site-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.treasure-site-info {
  flex: 1;
  margin-left: 16px;
  overflow: hidden;
}
.treasure-site-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.treasure-site-desc {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.treasure-site-arrow {
  color: #ccc;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.treasure-site-card:hover .treasure-site-arrow {
  color: var(--site-color);
  transform: translateX(4px);
}
.treasure-close-btn {
  color: #999;
}
</style>
