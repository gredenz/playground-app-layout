<template>
  <div class="p-6 h-full bg-green-50">
    <h1 class="text-2xl font-bold text-green-800 mb-4">Debug Tool - Main Panel</h1>
    <div class="space-y-4">
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="font-semibold text-lg mb-2">System Information</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Current Time:</strong> {{ currentTime }}</div>
          <div><strong>User Agent:</strong> {{ userAgent }}</div>
          <div><strong>Screen Size:</strong> {{ screenSize }}</div>
          <div><strong>Viewport Size:</strong> {{ viewportSize }}</div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="font-semibold text-lg mb-2">App State</h2>
        <pre class="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">{{ appState }}</pre>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="font-semibold text-lg mb-3">Banner System Testing</h2>
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="showMaintenanceBanner"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
          >
            Show Maintenance
          </button>
          <button
            @click="showInfoBanner"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Show Info
          </button>
          <button
            @click="showWarningBanner"
            class="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
          >
            Show Warning
          </button>
          <button
            @click="showErrorBanner"
            class="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            Show Error
          </button>
          <button
            @click="showSuccessBanner"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
          >
            Show Success
          </button>
          <button
            @click="hideBanner"
            class="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Hide Banner
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          Test different banner types and behaviors. Persistent banners survive page refresh.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { bannerHelpers } from '@/utils/bannerHelpers'

const appStore = useAppStore()
const currentTime = ref(new Date().toLocaleString())

const userAgent = computed(() => navigator.userAgent.substring(0, 100) + '...')
const screenSize = computed(() => `${screen.width}x${screen.height}`)
const viewportSize = computed(() => `${window.innerWidth}x${window.innerHeight}`)
const appState = computed(() => JSON.stringify({
  activeTool: appStore.activeTool?.name,
  layoutMode: appStore.currentLayoutMode,
  isLoading: appStore.isLoading,
  toolsCount: appStore.availableTools.length,
  activeBanner: appStore.activeBanner?.type || null
}, null, 2))

// Banner testing functions
const showMaintenanceBanner = () => {
  bannerHelpers.showMaintenance()
}

const showInfoBanner = () => {
  bannerHelpers.showInfo(
    'New Feature Available',
    'Check out the new banner notification system! This message will auto-hide in a few seconds.'
  )
}

const showWarningBanner = () => {
  bannerHelpers.showWarning(
    'Browser Compatibility Notice',
    'For the best experience, please use Chrome, Firefox, or Safari.'
  )
}

const showErrorBanner = () => {
  bannerHelpers.showError(
    'Connection Error',
    'Unable to connect to the server. Please check your internet connection and try again.'
  )
}

const showSuccessBanner = () => {
  bannerHelpers.showSuccess(
    'Data Saved Successfully',
    'Your changes have been saved and will be available immediately.'
  )
}

const hideBanner = () => {
  bannerHelpers.hide()
}

let timeInterval: ReturnType<typeof setInterval>

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>