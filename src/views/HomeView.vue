<template>
  <ThreePanelLayout class="bg-red-300">
    <template #main>
      <div class="bg-gray-300 flex-col h-full">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>

        <!-- Debug info -->
        <div class="p-2 bg-yellow-100 text-sm">
          <p>Active Tool: {{ toolStore.activeTool }}</p>
          <p>Component Loaded: {{ activeToolComponent !== null }}</p>
          <p>Component Type: {{ typeof activeToolComponent }}</p>
          <p>Is Loading: {{ isLoading }}</p>
        </div>

        <component :is="toolStore.activeToolComponent" v-if="toolStore.activeToolComponent" />
        <div v-else class="p-4">Select a tool to get started (or component failed to load)</div>
      </div>
    </template>
    <template #middle>
      <div class="bg-blue-300 flex h-full">
        Tool Area
      </div>
    </template>
    <template #right>
      <ToolList />
    </template>
  </ThreePanelLayout>
</template>

<script setup lang="ts">
import { useToolStore, type Tool } from '@/stores/tool.store'
import ThreePanelLayout from '@/ThreePanelLayout.vue'
import ToolList from '@/components/ToolList.vue'
import { onMounted, watch } from 'vue'

const toolStore = useToolStore()
const { activeToolComponent, isLoading } = toolStore

// Log when component changes
watch(() => toolStore.activeToolComponent, (newComp) => {
  console.log('Component changed:', newComp)
  console.log('Component type:', typeof newComp)
}, { immediate: true })

// Force a tool selection on mount to ensure initialization
onMounted(() => {
  console.log('HomeView mounted, current tool:', toolStore.activeTool)
  console.log('Current component:', toolStore.activeToolComponent)

  // If no component is loaded, try forcing it
  if (!toolStore.activeToolComponent) {
    console.log('No component loaded, forcing selection')
    toolStore.setActiveTool(toolStore.activeTool)
  }
})
</script>