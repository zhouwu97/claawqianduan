<template>
  <v-app>
    <div class="vapp-fullscreen-background"
      :class="{ 'radius-before': dialog }"
      :style="{'--leleo-background-image-url': getBackgroundUrlStyle,'--leleo-welcomtitle-color': welcomecolor, '--leleo-vcard-color':color,'--leleo-brightness': brightness+'%','--leleo-blur': blur+'px'}">

      <!-- 浮动开关 -->
      <div class="floating-switch-container"><v-switch :false-value="'video'" :true-value="'pic'" density="compact" color="#eee" class="floating-switch ma-4" v-model="lickbackgroundType" hide-details inset></v-switch></div>

      <!-- 背景视频 -->
      <transition name="fade"><video v-show="VideoState" autoplay muted loop class="video-bg" :style="(smAndDown?{'width':'100%','height':'100%'}:{width:'100%',height:'100%'})"><source :src="VideoURL" type="video/mp4"></video></transition>

      <!-- loading -->
      <div class="loading" v-if="homeshow"><loader></loader></div>

      <v-row v-if="!homeshow && !dialog" no-gutters
        :class="xs ? 'flex-column' : ''">
        <!-- 左侧固定面板 -->
        <v-col cols="12" md="4" class="leleo-left" :style="xs||sm ? { 'max-height': '100vh', 'overflow-y': 'auto' } : { 'max-height': '100vh', 'overflow-y': 'auto' }">
          <div>
            <div :style="xs ? { 'font-size': '2rem' } : { 'font-size': '4rem' }" class="leleo-left-welcome">
              {{ configdata.welcometitle }}
            </div>
          </div>

          <!-- 头像+音乐播放 -->
          <div style="position: relative;" class="leleo-left-avatar">
            <v-avatar size="170" rounded="circle" class="mt-n2" v-if="!picLoading">
              <v-img @load="picLoading = false" class="leleo-spin" src="/img/avatar.jpg" aspect-ratio="1" cover loading="lazy"></v-img>
            </v-avatar>
            <div v-if="picLoading" class="loading-spinner"><v-progress-circular size="90" color="#FF89B5" indeterminate></v-progress-circular></div>
            <div class="musicplayer">
              <v-btn @click="skipbackMusic" icon="mdi-skip-previous" variant="text" :size="xs ? 28 : 38" class="mr-2 bg-black" style="opacity: 0.8;"></v-btn>
              <v-btn @click="playorpaush" :icon="isplay ? 'mdi-pause' : 'mdi-play'" variant="text" :size="xs ? 28 : 38" class="bg-black" style="opacity: 0.8;"></v-btn>
              <v-btn @click="playnextMusic" :icon="isplay ? 'mdi-skip-next' : 'mdi-skip-next'" variant="text" :size="xs ? 28 : 38" class="ml-2 bg-black" style="opacity: 0.8;"></v-btn>
            </div>
            <div class="musicplayer-text">
              <span v-if="title !== ''" :style="(xs||sm)?{'top':'88%','font-size':'12px','animation': 'marquee 12s linear infinite'}:{'top':'82%','font-size':'16px','animation': 'marquee 8s linear infinite'}" class="musicplayer-text">{{ title }}</span>
            </div>
          </div>

          <!-- 标签云 -->
          <div class="mt-3" style="width: 100%;">
            <v-chip class="mt-3" prepend-icon="mdi-tag-multiple-outline" size="large" style="color:var(--leleo-vcard-color);">标签云</v-chip>
            <v-chip v-for="tag in configdata.tags" :key="tag" :color="getrandomcolor()" :variant="Math.round(Math.random()) ? 'flat' : 'tonal'" :size="xs? 'x-small':'default'" density="comfortable" class="ma-1" @click="navigatortag(tag)">{{ tag }}</v-chip>
            <p style="font-size: 12px; color: gray;">tip: 点击标签可以复制~</p>
          </div>

          <!-- 技能雷达 -->
          <div class="mt-1" :style="xs ? { 'height': '350px', 'width': '360px' } : { 'height': '360px', 'width': '460px' }">
            <polarchart />
          </div>

          <!-- 社交图标 -->
          <div class="leleo-left-socialIconsContainer">
            <div class="setting"><v-btn @click="dialog = true" icon="mdi-cog" variant="text" size="x-small"></v-btn></div>
            <v-btn v-for="(lan, index) in configdata.socialPlatformIcons" :key="index" :href="lan.link" target="_blank" :icon="lan.icon" variant="text" class="leleo-social-bticon" size="large" :style="{ 'color': color }"></v-btn>
          </div>
          <div v-for="(lan, index) in configdata.statement" :key="index" style="font-size: 12px; color: gray; text-align: center;">{{ lan }}</div>
        </v-col>

        <!-- 右侧内容 -->
        <v-col cols="12" md="8" style="max-height: 100vh; overflow-y: auto;">
          <hoemright :formattedTime="formattedTime" :formattedDate="formattedDate" :configdata="configdata" :projectcards='projectcards'></hoemright>
        </v-col>
      </v-row>

      <!-- 设置弹窗 -->
      <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition" class="rounded-lg">
        <v-card :style="{'--leleo-blur': blur+'px','--leleo-vcard-color':color,'--leleo-background': 'rgba(255,240,245,0.95)', background: 'rgba(255,240,245,0.95)', 'border-radius': '16px'}">
          <v-toolbar density="compact" style="background: transparent;">
            <v-toolbar-title :style="{'color': color}">✨ 设置</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="dialog = false" variant="text" :style="{'color': color}"></v-btn>
          </v-toolbar>
          <v-tabs v-model="tab" slider-color="#FF89B5" height="30" align-tabs="center">
            <v-tab :style="{'color':color}" text="个性化" value="tab-1"></v-tab>
            <v-tab :style="{'color':color}" text="壁纸" value="tab-2"></v-tab>
            <v-tab :style="{'color':color}" text="音乐" value="tab-3"></v-tab>
          </v-tabs>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="tab-1"><tab1 @cancel="dialog = false" /></v-tabs-window-item>
            <v-tabs-window-item value="tab-2"><tab2 @cancel="dialog = false" /></v-tabs-window-item>
            <v-tabs-window-item value="tab-3"><tab3 :audio-player="audioPlayer" :is-playing="isplay" :audio-loading="audioLoading" :current-index="currentIndex" :from-lyrics="fromLyrics" :musicinfo="musicinfo" @update:current-index="currentIndex = $event" @update:is-playing="isplay = $event" @update:current-lyrics="fromLyrics = $event" /></v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-dialog>

      <v-snackbar :timeout="2000" color="#FFB6C1" rounded="pill" v-model="snackbar">{{ snackbartext }}</v-snackbar>
    </div>
  </v-app>
</template>

<script>
import loader from './components/loader.vue';
import hoemright from './components/hoemright.vue';
import polarchart from './components/polarchart.vue';
import tab1 from './components/tabs/tab1.vue';
import tab2 from './components/tabs/tab2.vue';
import tab3 from './components/tabs/tab3.vue';
import { useDisplay } from 'vuetify';
import config from './config.js';
import { setMeta, getFormattedTime, getFormattedDate } from './utils/common.js';
import { setCookie, getCookie, eraseCookie } from './utils/cookieUtils.js';
import { driver } from 'driver.js';

export default {
  components: {
    loader, hoemright, polarchart, tab1, tab2, tab3
  },
  setup() {
    const { xs, sm, smAndDown } = useDisplay();
    return { xs, sm, smAndDown };
  },
  data() {
    return {
      configdata: config,
      lickbackgroundType: 'pic',
      projectcards: config.projectcards,
      color: config.color.themecolor,
      welcomecolor: config.color.welcometitlecolor,
      brightness: config.brightness,
      blur: config.blur,
      formattedTime: '',
      formattedDate: '',
      homeshow: true,
      picLoading: true,
      dialog: false,
      musicinfo: [],
      currentIndex: 0,
      fromLyrics: { index: -1, lyrics: [] },
      audioPlayer: new Audio(),
      audioLoading: false,
      isplay: false,
      playedOnce: false,
      title: '',
      snackbar: false,
      snackbartext: '',
      tab: null,
      timeInterval: null,
    }
  },
  watch: {
    brightness(val) {
      document.documentElement.style.setProperty('--leleo-brightness', val + '%');
    },
    blur(val) {
      document.documentElement.style.setProperty('--leleo-blur', val + 'px');
    },
  },
  computed: {
    getBackgroundUrlStyle() {
      const info = this.getBackData();
      return `url(${info.pic_url})`;
    },
    VideoState() {
      const info = this.getBackData();
      return info.video_url ? true : false;
    },
    VideoURL() {
      const info = this.getBackData();
      return info.video_url;
    },
  },
  methods: {
    setMeta,
    getCookie,
    setCookie,
    eraseCookie,
    getBackData() {
      let data = { pic_url: '', video_url: '' };
      if (this.lickbackgroundType === 'pic') {
        let leleoback = this.getCookie('leleodatabackground');
        if (leleoback) {
          let lp = (this.smAndDown ? leleoback.mobile.datainfo : leleoback.pc.datainfo);
          data.pic_url = lp.preview;
        } else {
          let lp = (this.smAndDown ? this.configdata.background.mobile.datainfo : this.configdata.background.pc.datainfo);
          data.pic_url = lp.preview;
        }
      } else {
        let leleoback = this.getCookie('leleodatabackground');
        if (leleoback) {
          let lv = (this.smAndDown ? leleoback.mobile.datainfo : leleoback.pc.datainfo);
          data.video_url = lv.preview;
          data.pic_url = lv.preview;
        } else {
          let lv = (this.smAndDown ? this.configdata.background.mobile.datainfo : this.configdata.background.pc.datainfo);
          if (lv.type === 'video') {
            data.video_url = lv.datainfo.preview;
            data.pic_url = lv.datainfo.preview;
          }
        }
      }
      return data;
    },
    loadThemeData() {
      let leleodata = this.getCookie("leleodata");
      if (leleodata) {
        this.color = leleodata.color.themecolor;
        this.welcomecolor = leleodata.color.welcometitlecolor;
        this.brightness = Number(leleodata.brightness);
        this.blur = Number(leleodata.blur);
      }
      document.documentElement.style.setProperty('--leleo-brightness', this.brightness + '%');
      document.documentElement.style.setProperty('--leleo-blur', this.blur + 'px');
    },
    async initMusic() {
      let m, id;
      let leleodata = this.getCookie("leleodatamusic");
      if (leleodata) {
        m = leleodata.server;
        id = leleodata.id;
      } else {
        m = this.configdata.musicPlayer.server;
        id = this.configdata.musicPlayer.id;
      }
      try {
        const response = await window.fetch(`https://api.i-meto.com/meting/api?server=${m}&type=playlist&id=${id}`);
        const data = await response.json();
        this.musicinfo = data.map(song => ({
          title: song.title,
          author: song.author,
          lrc: song.lrc,
          pic: song.pic,
          url: song.url
        }));
        if (this.musicinfo.length > 0) {
          this.loadMusic(0);
        }
      } catch (error) {
        console.log('Music API error:', error);
      }
    },
    async loadMusic(index) {
      if (!this.musicinfo[index]) return;
      this.audioLoading = true;
      this.currentIndex = index;
      this.audioPlayer.src = this.musicinfo[index].url;
      this.title = this.musicinfo[index].title + ' - ' + this.musicinfo[index].author;
      this.audioPlayer.load();
      this.audioPlayer.oncanplaythrough = () => {
        this.audioLoading = false;
        if (!this.playedOnce) {
          this.audioPlayer.play();
          this.isplay = true;
          this.playedOnce = true;
        }
      };
    },
    playorpaush() {
      if (this.isplay) {
        this.audioPlayer.pause();
      } else {
        if (!this.audioPlayer.src && this.musicinfo.length > 0) {
          this.loadMusic(0);
        } else {
          this.audioPlayer.play();
        }
      }
      this.isplay = !this.isplay;
    },
    playnextMusic() {
      let next = (this.currentIndex + 1) % this.musicinfo.length;
      this.loadMusic(next);
      this.isplay = true;
    },
    skipbackMusic() {
      let prev = (this.currentIndex - 1 + this.musicinfo.length) % this.musicinfo.length;
      this.loadMusic(prev);
      this.isplay = true;
    },
    getrandomcolor() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    },
    navigatortag(tag) {
      navigator.clipboard.writeText(tag);
      this.snackbartext = '已复制: ' + tag;
      this.snackbar = true;
    },
    initTime() {
      this.formattedTime = getFormattedTime(new Date());
      this.formattedDate = getFormattedDate(new Date());
      this.timeInterval = setInterval(() => {
        this.formattedTime = getFormattedTime(new Date());
        this.formattedDate = getFormattedDate(new Date());
      }, 1000);
    },
    guideTour() {
      if (this.getCookie('zhouzhou-tour-done')) return;
      setTimeout(() => {
        const driverObj = driver({ showProgress: true, steps: [
          { element: '.leleo-left-welcome', popover: { title: ' 欢迎来到周周的小世界', description: '这里是周周的个人主页，记录生活中的点滴。' }},
          { element: '.leleo-left-avatar', popover: { title: ' 音乐播放器', description: '点击头像周围的按钮控制音乐播放哦~' }},
          { element: '.setting', popover: { title: ' 设置', description: '点击齿轮可以更换主题颜色、壁纸和音乐！' }},
        ]});
        driverObj.drive();
        this.setCookie('zhouzhou-tour-done', true, 365);
      }, 2000);
    },
  },
  mounted() {
    this.loadThemeData();
    this.initTime();
    this.initMusic();
    this.guideTour();
    setMeta(this.configdata.metaData.title, this.configdata.metaData.description, this.configdata.metaData.keywords, this.configdata.metaData.icon);
    this.$nextTick(() => {
      setTimeout(() => {
        this.homeshow = false;
      }, 2000);
    });
  },
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.src = '';
    }
  },
};
</script>

<style scoped>
</style>
