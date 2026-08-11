<template>
  <v-dialog :model-value="modelValue" width="700" height="500" @update:model-value="(v) => emit('update:modelValue', v)">
    <v-card class="ma-3 pa-2" hover
      variant="tonal"
      rounded="lg"
      style="text-align: center;backdrop-filter: blur(10px);"
    >
      <template v-slot:title >
        <span class="leleo-card-title">关于</span>
      </template>
      <div style="display: flex;flex-direction: column;align-items: center;">
        <v-card class="ma-3 pa-2" hover
          variant="tonal"
          max-width="400"
          rounded="lg"
          style="text-align: center;"
        >
          <template v-slot:subtitle>
            <span class="leleo-card-subtitle">本页基于以下技术及服务搭建</span>
          </template>
          <div>
            <v-tooltip v-for="item in stackicons" v-model="item.model" location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" :color="item.color" rounded="lg" class="ma-1 stack-btn" size="35">
                  <v-icon size="25" color="white">{{item.icon}}</v-icon>
                </v-btn>
              </template>
              <span>{{item.tip}}</span>
            </v-tooltip>
          </div>
        </v-card>

        <p class="ma-6">
          <span v-for="item in configdata.statement">
            {{ item }}<br>
          </span>
          <br>
          <span>灵感源于 <a href="https://github.com/leleo886" target="_blank" style="color: inherit;">@GitHub leleo886</a></span>
        </p>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['modelValue', 'configdata'],
  emits: ['update:modelValue'],
  data() {
    return {
      stackicons: [
        { icon: "mdi-vuejs", color: "green", model: false, tip: 'vue' },
        { icon: "mdi-language-javascript", color: "#CAD300", model: false, tip: 'javascript' },
        { icon: "mdi-language-css3", color: "blue", model: false, tip: 'css' },
        { icon: "mdi-language-html5", color: "red", model: false, tip: 'html' },
        { icon: "$vuetify", color: "#1697F6", model: false, tip: 'vuetify' },
      ],
    }
  }
}
</script>
