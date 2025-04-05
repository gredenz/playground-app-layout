// stores/tool.store.ts
import { defineStore } from 'pinia'
import { ref, shallowRef, markRaw } from 'vue'

// Import components directly
// This is an alternative approach that may help with dynamic imports
// We'll keep the dynamic import for SpecSheetIntelligence

export type Tool = 'editor' | 'specSheet'

export const useToolStore = defineStore('tool', () => {
  // State
  const activeTool = ref<Tool>('editor')
  const activeToolComponent = shallowRef<any>(null)
  const isLoading = ref(true) // Start with loading true

  // Actions
  const setActiveTool = async (tool: Tool) => {
    console.log(`Setting active tool to: ${tool}`)
    isLoading.value = true
    activeTool.value = tool

    try {
      let component: any

      // Use static import for editor (guaranteed to work)

      // Dynamic import for other components
      console.log(`Dynamically importing: ${tool}`)
      component = await import(
        `../components/mainComponentTools/${tool.charAt(0).toUpperCase() + tool.slice(1)}.vue`
      )

      console.log('Component loaded:', component)
      console.log('Default export:', component.default)

      // Use markRaw to ensure Vue doesn't try to make the component reactive
      activeToolComponent.value = markRaw(component.default)
      console.log('Component set to:', activeToolComponent.value)
    } catch (error) {
      console.error(`Failed to load tool: ${tool}`, error)
      activeToolComponent.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Initialize with default tool immediately
  console.log('Initializing store with default tool')
  setActiveTool('editor')

  return {
    activeTool,
    activeToolComponent,
    isLoading,
    setActiveTool,
  }
})
