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
        
        <!-- Preset Banner Buttons -->
        <div class="grid grid-cols-2 gap-3 mb-4">
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

        <!-- Custom Banner Creator -->
        <div class="border-t pt-3">
          <h3 class="font-medium text-sm mb-2">Create Custom Banner</h3>
          <div class="space-y-2">
            <div class="flex gap-2">
              <select 
                v-model="customBanner.type" 
                class="text-xs border rounded px-2 py-1 flex-none"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <input
                v-model="customBanner.title"
                placeholder="Banner title..."
                class="text-xs border rounded px-2 py-1 flex-1"
              >
            </div>
            <textarea
              v-model="customBanner.message"
              placeholder="Banner message (optional)..."
              class="w-full text-xs border rounded px-2 py-1 h-16 resize-none"
            ></textarea>
            <div class="flex gap-2 items-center">
              <label class="text-xs flex items-center">
                <input 
                  v-model="customBanner.dismissible" 
                  type="checkbox" 
                  class="mr-1"
                > 
                Dismissible
              </label>
              <label class="text-xs flex items-center">
                <input 
                  v-model="customBanner.autoHide" 
                  type="checkbox" 
                  class="mr-1"
                > 
                Auto-hide
              </label>
              <label class="text-xs flex items-center">
                <input 
                  v-model="customBanner.persistent" 
                  type="checkbox" 
                  class="mr-1"
                > 
                Persistent
              </label>
            </div>
            <button
              @click="showCustomBanner"
              :disabled="!customBanner.title.trim()"
              class="w-full px-3 py-2 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Show Custom Banner
            </button>
          </div>
        </div>

        <p class="text-xs text-gray-500 mt-3">
          Test different banner types and behaviors. Persistent banners survive page refresh.
        </p>
      </div>

      <!-- Toast System Testing -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="font-semibold text-lg mb-3">Toast System Testing</h2>
        
        <!-- Toast Testing Buttons -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <button
            @click="showSuccessToast"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
          >
            Success Toast
          </button>
          <button
            @click="showInfoToast"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Info Toast
          </button>
          <button
            @click="showWarningToast"
            class="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
          >
            Warning Toast
          </button>
          <button
            @click="showErrorToast"
            class="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            Error Toast
          </button>
          <button
            @click="showOperationSuccess"
            class="px-3 py-2 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600 transition-colors"
          >
            Operation Success
          </button>
          <button
            @click="showOperationError"
            class="px-3 py-2 bg-rose-500 text-white rounded text-sm hover:bg-rose-600 transition-colors"
          >
            Operation Error
          </button>
          <button
            @click="showNetworkError"
            class="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Network Error
          </button>
          <button
            @click="clearAllToasts"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
          >
            Clear All Toasts
          </button>
        </div>

        <p class="text-xs text-gray-500 mt-3">
          Test different toast notifications. Success/info toasts auto-hide, errors are sticky.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { useBanner } from '@/composables/useBanner'
import { bannerHelpers } from '@/utils/bannerHelpers'
import { toastHelpers } from '@/utils/toastHelpers'

const appStore = useAppStore()
const { activeBanner } = useBanner()
const currentTime = ref(new Date().toLocaleString())

// Custom banner form
const customBanner = ref({
  type: 'info' as 'info' | 'warning' | 'error' | 'success' | 'maintenance',
  title: '',
  message: '',
  dismissible: true,
  autoHide: false,
  persistent: false
})

const userAgent = computed(() => navigator.userAgent.substring(0, 100) + '...')
const screenSize = computed(() => `${screen.width}x${screen.height}`)
const viewportSize = computed(() => `${window.innerWidth}x${window.innerHeight}`)
const appState = computed(() => JSON.stringify({
  activeTool: appStore.activeTool?.name,
  layoutMode: appStore.currentLayoutMode,
  isLoading: appStore.isLoading,
  toolsCount: appStore.availableTools.length,
  activeBanner: activeBanner.value?.type || null
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

// Custom banner function
const showCustomBanner = () => {
  const bannerConfig = {
    type: customBanner.value.type,
    title: customBanner.value.title,
    message: customBanner.value.message || undefined,
    dismissible: customBanner.value.dismissible,
    autoHide: customBanner.value.autoHide,
    autoHideDelay: customBanner.value.autoHide ? 5000 : undefined,
    persistent: customBanner.value.persistent
  }
  
  bannerHelpers.showCustom(bannerConfig)
  
  // Reset form after creating banner
  customBanner.value = {
    type: 'info',
    title: '',
    message: '',
    dismissible: true,
    autoHide: false,
    persistent: false
  }
}

// Toast testing functions
const showSuccessToast = () => {
  toastHelpers.success('Data Saved', 'Your changes have been saved successfully')
}

const showInfoToast = () => {
  toastHelpers.info('New Feature', 'Check out our new toast notification system!')
}

const showWarningToast = () => {
  toastHelpers.warn('Browser Warning', 'Please update your browser for the best experience')
}

const showErrorToast = () => {
  toastHelpers.error('Server Error', 'Unable to connect to the server. Please try again.')
}

const showOperationSuccess = () => {
  toastHelpers.operationSuccess('File Upload', 'The file was uploaded and processed')
}

const showOperationError = () => {
  toastHelpers.operationError('Database Query', 'Connection timeout occurred')
}

const showNetworkError = () => {
  toastHelpers.networkError('Connection lost while syncing data')
}

const clearAllToasts = () => {
  toastHelpers.clear()
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