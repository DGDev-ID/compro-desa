import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createUnhead } from '@unhead/vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

import App from './App.vue'
import router from './router'
import './assets/main.css'

AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
})

const app = createApp(App)

// Initialise unhead and provide to Vue app context
const head = createUnhead()
app.provide('usehead', head)

app.use(createPinia())
app.use(router)

app.mount('#app')
