import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

const app = createApp(App)
const pinia = createPinia()
app.use(PrimeVue, {
  theme: 'none',
})

app.use(pinia)
app.use(router)
app.mount('#app')
