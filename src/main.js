import { createApp } from 'vue'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import './style/app.less'
import './style/mobile.less'

const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
    },
    defaults: {
        VCard: {
            variant: 'tonal',
        },
    },
})
const app = createApp(App);
app.use(vuetify).mount('#app')
