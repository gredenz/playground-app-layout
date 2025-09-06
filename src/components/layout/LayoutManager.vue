<template>
  <div class="border-4 border-purple-800 w-full">
    <!-- 3 Column Layout -->
    <div v-if="appStore.currentLayoutMode === '3col'" class="h-full flex " data-testid="main-panel">
      <!-- Resizable left and middle panels -->
      <div class="flex-1 h-full">
        <Splitter class="h-full">
          <SplitterPanel :size="70" :min-size="40" class="bg-gray-100">
            <ErrorBoundary>
              <component :is="appStore.activeComponents.main" v-if="appStore.activeComponents.main" />
              <div v-else class="p-4">Loading main...</div>
            </ErrorBoundary>
          </SplitterPanel>
          <SplitterPanel :size="30" :min-size="20" class="bg-gray-200">
            <ErrorBoundary>
              <component :is="appStore.activeComponents.middle" v-if="appStore.activeComponents.middle" />
              <div v-else class="p-4">Loading middle...</div>
            </ErrorBoundary>
          </SplitterPanel>
        </Splitter>
      </div>
      <!-- Fixed ToolList right panel -->
      <div class="w-80 bg-gray-300">
        <ErrorBoundary>
          <component :is="appStore.activeComponents.right" v-if="appStore.activeComponents.right" />
          <div v-else class="p-4">Loading sidebar...</div>
        </ErrorBoundary>
      </div>
    </div>

    <!-- 2 Column Layout -->
    <div v-else-if="appStore.currentLayoutMode === '2col'" class="h-full flex">
      <!-- Main content panel -->
      <div class="flex-1 bg-gray-100">
        <ErrorBoundary>
          <component :is="appStore.activeComponents.main" v-if="appStore.activeComponents.main" />
          <div v-else class="p-4">Loading main...</div>
        </ErrorBoundary>
      </div>
      <!-- Fixed ToolList right panel -->
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { registerAllTools } from '@/plugins'
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue'

const appStore = useAppStore()

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
