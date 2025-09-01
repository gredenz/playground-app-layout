import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import { setToastService } from '@/utils/toastService'

const app = createApp(App)
const pinia = createPinia()
app.use(PrimeVue, {
  theme: 'none',
})
app.use(ToastService)
app.component('Toast', Toast)

app.use(pinia)
app.use(router)

// Mount the app and set up toast service
const mountedApp = app.mount('#app')

// The toast service will be available through the app instance after mounting
// We'll set it up in a component that can access it via inject
