import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { toolRegistry } from '@/core/ToolRegistry'

export const useAppStore = defineStore('app', () => {
  // State
  const currentLayoutMode = ref<'3col' | '2col' | 'focused'>('3col')
  const activeComponents = shallowRef<{
    main: any
    middle?: any
    right?: any
  }>({ main: null })
  const isLoading = ref(false)
  
  // Actions
  async function switchTool(toolId: string) {
    isLoading.value = true
    try {
      const tool = await toolRegistry.activate(toolId)
      
      // Use tool's default layout if current mode isn't supported
      let layoutMode = currentLayoutMode.value
      if (!tool.layouts[layoutMode] && tool.defaultLayout) {
        layoutMode = tool.defaultLayout
        currentLayoutMode.value = layoutMode
      }
      
      // Load components for the layout mode
      await loadLayoutComponents(tool, layoutMode)
    } catch (error) {
      console.error('Failed to switch tool:', error)
      // Show user-friendly error message
      alert(`Failed to activate tool: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      isLoading.value = false
    }
  }
  
  async function switchLayoutMode(mode: '3col' | '2col' | 'focused') {
    const tool = toolRegistry.getActiveTool()
    if (!tool) {
      console.warn('No active tool')
      return
    }
    
    // Check if tool supports this mode
    if (!tool.layouts || !tool.layouts[mode]) {
      console.warn(`Tool ${tool.id} doesn't support ${mode} layout`)
      return
    }
    
    currentLayoutMode.value = mode
    await loadLayoutComponents(tool, mode)
  }
  
  async function loadLayoutComponents(tool: any, mode: string) {
    console.log('loadLayoutComponents called with:', { toolName: tool.name, mode })
    const layout = tool.layouts[mode]
    if (!layout) {
      console.error('No layout found for mode:', mode)
      return
    }
    
    console.log('Layout slots:', layout.slots)
    const components: any = {}
    
    // Load all components in parallel
    const loaders = Object.entries(layout.slots).map(async ([slot, loader]) => {
      if (loader && typeof loader === 'function') {
        try {
          console.log(`Loading ${slot}...`)
          const module = await (loader as any)()
          components[slot] = module.default
          console.log(`Loaded ${slot}:`, module.default)
        } catch (error) {
          console.error(`Failed to load ${slot} component:`, error)
        }
      }
    })
    
    await Promise.all(loaders)
    console.log('Final components:', components)
    activeComponents.value = components
  }
  
  // Computed
  const activeTool = computed(() => toolRegistry.getActiveTool())
  const availableTools = computed(() => toolRegistry.getAllTools())
  
  return {
    // State
    currentLayoutMode,
    activeComponents,
    isLoading,
    
    // Computed
    activeTool,
    availableTools,
    
    // Actions
    switchTool,
    switchLayoutMode
  }
})