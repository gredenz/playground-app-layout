<template>
  <div class="p-4 h-full bg-green-100">
    <h2 class="text-lg font-bold text-green-800 mb-4">Debug Controls</h2>
    
    <div class="space-y-4">
      <div class="bg-white p-3 rounded shadow">
        <h3 class="font-semibold mb-2">Actions</h3>
        <div class="space-y-2">
          <button @click="refreshData" class="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
            Refresh Data
          </button>
          <button @click="clearConsole" class="w-full px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm">
            Clear Console
          </button>
          <button @click="toggleDebugMode" class="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            {{ debugMode ? 'Disable' : 'Enable' }} Debug Mode
          </button>
        </div>
      </div>
      
      <div class="bg-white p-3 rounded shadow">
        <h3 class="font-semibold mb-2">Memory Usage</h3>
        <div class="text-sm space-y-1">
          <div>Used: {{ memoryInfo.usedJSHeapSize }}</div>
          <div>Total: {{ memoryInfo.totalJSHeapSize }}</div>
          <div>Limit: {{ memoryInfo.jsHeapSizeLimit }}</div>
        </div>
      </div>
      
      <div class="bg-white p-3 rounded shadow">
        <h3 class="font-semibold mb-2">Performance</h3>
        <div class="text-sm">
          <div>Load Time: {{ loadTime }}ms</div>
          <div>Components: {{ componentCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()
const debugMode = ref(false)
const loadTime = ref(0)

const memoryInfo = computed(() => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      usedJSHeapSize: formatBytes(memory.usedJSHeapSize),
      totalJSHeapSize: formatBytes(memory.totalJSHeapSize),
      jsHeapSizeLimit: formatBytes(memory.jsHeapSizeLimit)
    }
  }
  return {
    usedJSHeapSize: 'N/A',
    totalJSHeapSize: 'N/A', 
    jsHeapSizeLimit: 'N/A'
  }
})

const componentCount = computed(() => {
  return Object.keys(appStore.activeComponents).length
})

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const refreshData = () => {
  console.log('Debug data refreshed at', new Date().toISOString())
}

const clearConsole = () => {
  console.clear()
  console.log('Console cleared by Debug Tool')
}

const toggleDebugMode = () => {
  debugMode.value = !debugMode.value
  console.log('Debug mode:', debugMode.value ? 'enabled' : 'disabled')
}

onMounted(() => {
  loadTime.value = Math.round(performance.now())
})
</script>