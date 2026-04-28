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

    <v-dialog v-model="cardDialog" max-width="500">
      <v-card>
        <v-card-title>{{ selectedCard?.title }}</v-card-title>
        <v-card-text>
          <div class="text-body-1 mb-3">{{ selectedCard?.text }}</div>
          <div class="d-flex align-center gap-2">
            <v-text-field v-model="selectedCardUrl" readonly dense variant="outlined" hide-details></v-text-field>
            <v-btn icon variant="tonal" @click="copyUrl">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn icon variant="tonal" :href="selectedCard?.url" target="_blank">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="cardDialog = false">关闭</v-btn>
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
      this.selectedCard = item;
      this.selectedCardUrl = item.url;
      this.cardDialog = true;
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
</style>
