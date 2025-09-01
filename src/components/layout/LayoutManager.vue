<template>
  <div class="h-screen w-screen">
    <!-- 3 Column Layout -->
    <div v-if="appStore.currentLayoutMode === '3col'" class="flex h-full" data-testid="main-panel">
      <div class="flex-1 bg-gray-100">
        <ErrorBoundary>
          <component :is="appStore.activeComponents.main" v-if="appStore.activeComponents.main" />
          <div v-else class="p-4">Loading main...</div>
        </ErrorBoundary>
      </div>
      <div class="w-96 bg-gray-200">
        <ErrorBoundary>
          <component :is="appStore.activeComponents.middle" v-if="appStore.activeComponents.middle" />
          <div v-else class="p-4">Loading middle...</div>
        </ErrorBoundary>
      </div>
      <div class="w-80 bg-gray-300">
        <ErrorBoundary>
          <component :is="appStore.activeComponents.right" v-if="appStore.activeComponents.right" />
          <div v-else class="p-4">Loading sidebar...</div>
        </ErrorBoundary>
      </div>
    </div>

    <!-- 2 Column Layout -->
    <div v-else-if="appStore.currentLayoutMode === '2col'" class="flex h-full">
      <div class="flex-1 bg-gray-100">
        <ErrorBoundary>
          <component :is="appStore.activeComponents.main" v-if="appStore.activeComponents.main" />
          <div v-else class="p-4">Loading main...</div>
        </ErrorBoundary>
      </div>
      <div class="w-96 bg-gray-300">
        <ErrorBoundary>
          <component :is="appStore.activeComponents.right" v-if="appStore.activeComponents.right" />
          <div v-else class="p-4">Loading sidebar...</div>
        </ErrorBoundary>
      </div>
    </div>

    <!-- Focused Layout -->
    <div v-else-if="appStore.currentLayoutMode === 'focused'" class="h-full">
      <ErrorBoundary>
        <component :is="appStore.activeComponents.main" v-if="appStore.activeComponents.main" />
        <div v-else class="p-4">Loading...</div>
      </ErrorBoundary>
    </div>

    <!-- Debug Controls -->
    <div class="fixed top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-50">
      <div class="space-y-3">
        <!-- Tool Selector -->
        <div>
          <label class="text-xs font-semibold text-gray-600">Active Tool:</label>
          <select 
            data-testid="tool-selector"
            @change="(e) => appStore.switchTool((e.target as HTMLSelectElement).value)"
            class="ml-2 text-sm border rounded px-2 py-1"
            :value="appStore.activeTool?.id"
          >
            <option v-for="tool in appStore.availableTools" :key="tool.id" :value="tool.id">
              {{ tool.name }}
            </option>
          </select>
        </div>

        <!-- Layout Mode Selector -->
        <div>
          <label class="text-xs font-semibold text-gray-600">Layout:</label>
          <div class="flex gap-1 mt-1" data-testid="layout-toggle">
            <button
              v-for="mode in layoutModes"
              :key="mode"
              @click="appStore.switchLayoutMode(mode)"
              class="px-2 py-1 text-xs rounded transition-colors"
              :class="appStore.currentLayoutMode === mode 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'"
              :disabled="!isLayoutSupported(mode)"
            >
              {{ mode }}
            </button>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="appStore.isLoading" class="text-xs text-blue-500">
          Loading...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { registerAllTools } from '@/plugins'
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue'

const appStore = useAppStore()
const layoutModes = ['3col', '2col', 'focused'] as const

const isLayoutSupported = (mode: string) => {
  const tool = appStore.activeTool
  if (!tool) return false
  return !!tool.layouts[mode as keyof typeof tool.layouts]
}

onMounted(async () => {
  // Register all tools on mount
  registerAllTools()
  
  // Activate first tool
  const tools = appStore.availableTools
  if (tools.length > 0) {
    await appStore.switchTool(tools[0].id)
  }
})
</script>