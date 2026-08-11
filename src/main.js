import { createApp } from 'vue'
import App from './App.vue'

import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/motion.css'
import './styles/responsive.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
    },
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
app.config.warnHandler = () => {};
app.use(vuetify).mount('#app')
