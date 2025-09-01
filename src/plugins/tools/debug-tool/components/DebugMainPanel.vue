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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()
const currentTime = ref(new Date().toLocaleString())

const userAgent = computed(() => navigator.userAgent.substring(0, 100) + '...')
const screenSize = computed(() => `${screen.width}x${screen.height}`)
const viewportSize = computed(() => `${window.innerWidth}x${window.innerHeight}`)
const appState = computed(() => JSON.stringify({
  activeTool: appStore.activeTool?.name,
  layoutMode: appStore.currentLayoutMode,
  isLoading: appStore.isLoading,
  toolsCount: appStore.availableTools.length
}, null, 2))

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