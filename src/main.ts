import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Message from 'primevue/message'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

const app = createApp(App)
const pinia = createPinia()
app.use(PrimeVue, {
  theme: 'none',
})
app.use(ToastService)
app.component('Toast', Toast)
app.component('Message', Message)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)

app.use(pinia)
app.use(router)
app.mount('#app')
