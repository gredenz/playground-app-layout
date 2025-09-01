import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { toolRegistry } from '@/core/ToolRegistry'

export interface BannerNotification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success' | 'maintenance'
  title: string
  message?: string
  dismissible?: boolean
  autoHide?: boolean
  autoHideDelay?: number
  persistent?: boolean // Survives page refresh
}

export const useAppStore = defineStore('app', () => {
  // State
  const currentLayoutMode = ref<'3col' | '2col' | 'focused'>('3col')
  const activeComponents = shallowRef<{
    main: any
    middle?: any
    right?: any
  }>({ main: null })
  const isLoading = ref(false)
  
  // Banner state
  const activeBanner = ref<BannerNotification | null>(null)
  const dismissedBanners = ref<string[]>([]) // Track dismissed banner IDs
  
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
    const layout = tool.layouts[mode]
    if (!layout) {
      console.error('No layout found for mode:', mode)
      return
    }
    
    const components: any = {}
    
    // Load all components in parallel
    const loaders = Object.entries(layout.slots).map(async ([slot, loader]) => {
      if (loader && typeof loader === 'function') {
        try {
          const module = await (loader as any)()
          components[slot] = module.default
        } catch (error) {
          console.error(`Failed to load ${slot} component:`, error)
        }
      }
    })
    
    await Promise.all(loaders)
    activeComponents.value = components
  }
  
  // Banner actions
  function showBanner(banner: Omit<BannerNotification, 'id'>) {
    const bannerWithId: BannerNotification = {
      ...banner,
      id: `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    // Check if banner was previously dismissed (unless it's not dismissible)
    if (banner.dismissible !== false && dismissedBanners.value.includes(bannerWithId.id)) {
      return
    }
    
    activeBanner.value = bannerWithId
    
    // Save persistent banners to localStorage
    if (banner.persistent) {
      localStorage.setItem('app-banner', JSON.stringify(bannerWithId))
    }
  }
  
  function dismissBanner() {
    if (activeBanner.value) {
      // Track dismissed banner to prevent re-showing
      dismissedBanners.value.push(activeBanner.value.id)
      
      // Remove from localStorage if persistent
      if (activeBanner.value.persistent) {
        localStorage.removeItem('app-banner')
      }
      
      activeBanner.value = null
    }
  }
  
  function hideBanner() {
    activeBanner.value = null
  }
  
  // Load persistent banner from localStorage on init
  function loadPersistentBanner() {
    const savedBanner = localStorage.getItem('app-banner')
    if (savedBanner) {
      try {
        const banner = JSON.parse(savedBanner) as BannerNotification
        // Only show if not previously dismissed
        if (!dismissedBanners.value.includes(banner.id)) {
          activeBanner.value = banner
        }
      } catch (error) {
        console.warn('Failed to load persistent banner:', error)
        localStorage.removeItem('app-banner')
      }
    }
  }

  // Computed
  const activeTool = computed(() => toolRegistry.getActiveTool())
  const availableTools = computed(() => toolRegistry.getAllTools())
  
  return {
    // State
    currentLayoutMode,
    activeComponents,
    isLoading,
    activeBanner,
    
    // Computed
    activeTool,
    availableTools,
    
    // Actions
    switchTool,
    switchLayoutMode,
    
    // Banner actions
    showBanner,
    dismissBanner,
    hideBanner,
    loadPersistentBanner
  }
})