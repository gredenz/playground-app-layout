// stores/tool.store.ts
import { defineStore } from 'pinia'
import { ref, shallowRef, markRaw, computed } from 'vue'

export type Tool = 'seoScore' | 'specSheetHosting' // Add more tools
export type MainComponentTool = 'editor' | 'specSheet' // Add more main components

// Tool to MainComponentTool mapping
const toolToMainComponentMap: Record<Tool, MainComponentTool> = {
  seoScore: 'editor',
  specSheetHosting: 'specSheet',
  // Add more mappings as needed
}

export const useToolStore = defineStore('tool', () => {
  // State
  const activeTool = ref<Tool>('seoScore')
  const activeMainComponentTool = computed<MainComponentTool>(() => {
    return toolToMainComponentMap[activeTool.value]
  })

  // Component references
  const activeToolComponent = shallowRef<any>(null)
  const activeMainComponent = shallowRef<any>(null)
  const isLoading = ref(true)

  // Actions
  const setActiveTool = async (tool: Tool) => {
    isLoading.value = true
    activeTool.value = tool

    try {
      // 1. Load the specific tool component
      const toolComponentName = tool.charAt(0).toUpperCase() + tool.slice(1)
      const toolComponent = await import(`@/components/tools/${toolComponentName}.vue`)
      activeToolComponent.value = markRaw(toolComponent.default)

      // 2. Load the corresponding main component
      const mainComponent = toolToMainComponentMap[tool]
      const mainComponentName = mainComponent.charAt(0).toUpperCase() + mainComponent.slice(1)
      const mainComponentModule = await import(
        `@/components/mainComponentTools/${mainComponentName}.vue`
      )
      activeMainComponent.value = markRaw(mainComponentModule.default)
    } catch (error) {
      console.error('Failed to load components:', error)
      activeToolComponent.value = null
      activeMainComponent.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Initialize with default tool immediately
  setActiveTool('seoScore')

  return {
    // State
    activeTool,
    activeMainComponentTool,

    // Component instances
    activeToolComponent,
    activeMainComponent,

    isLoading,
    setActiveTool,
  }
})
