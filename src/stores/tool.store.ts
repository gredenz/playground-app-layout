// stores/tool.store.ts
import { defineStore } from 'pinia'
import { ref, shallowRef, markRaw, computed } from 'vue'

export type Tool = 'SeoScore' | 'SpecSheetHosting' | 'NewTool' // Add more tools
export type LayoutMode = '3col' | '2col' | 'focused'

export interface LayoutConfiguration {
	main: string // what component goes in main area
	middle?: string // what goes in middle (3col only)
	right: string // what goes in right sidebar
}

export interface ToolLayoutConfig {
	supportedModes: Array<LayoutMode>
	defaultMode: LayoutMode
	configurations: Partial<Record<LayoutMode, LayoutConfiguration>>
}

// Component path mappings for dynamic imports
const componentPaths = {
	// Main components
	Editor: () => import('@/components/mainComponents/Editor.vue'),
	SpecSheet: () => import('@/components/mainComponents/SpecSheet.vue'),

	// Tool components
	SeoScore: () => import('@/components/tools/SeoScore.vue'),
	SpecSheetHosting: () => import('@/components/tools/SpecSheetHosting.vue'),

	// Other components
	ToolList: () => import('@/components/ToolList.vue')
}

// Layout configurations for each tool
const toolLayoutConfigs: Record<Tool, ToolLayoutConfig> = {
	SeoScore: {
		supportedModes: ['3col', '2col', 'focused'],
		defaultMode: '3col',
		configurations: {
      '3col': {
				main: 'Editor',
				middle: 'SeoScore',
				right: 'ToolList'
			},
			'2col': {
				main: 'Editor',
				right: 'ToolList'
			},
      'focused': {
        main: 'SeoScore',
        right: 'hidden'
      }
		}
	},
  NewTool: {
		supportedModes: ['2col', '3col'],
		defaultMode: '2col',
		configurations: {
			'2col': {
				main: 'Editor',
				right: 'ToolList'  // reusing SeoScore component
			},
      '3col': {
				main: 'SpecSheet',
				middle: 'SeoScore',  // reusing SeoScore component
				right: 'ToolList'
			}
		}
	},
	SpecSheetHosting: {
		supportedModes: ['3col', '2col', 'focused'],
		defaultMode: '3col',
		configurations: {
			'3col': {
				main: 'Editor',
				middle: 'SpecSheetHosting',
				right: 'ToolList'
			},
			'2col': {
				main: 'SpecSheet',
				right: 'ToolList'
			},
			'focused': {
				main: 'SpecSheet',
				right: 'hidden'
			}
		}
	}
}

export const useToolStore = defineStore('tool', () => {
	// State
	const activeTool = ref<Tool>('SeoScore')
	const activeLayoutMode = ref<LayoutMode>('2col')

	// Computed properties

	const currentToolConfig = computed(() => {
		return toolLayoutConfigs[activeTool.value]
	})

	const currentLayoutConfig = computed(() => {
		const config = currentToolConfig.value.configurations[activeLayoutMode.value]
		if (!config) {
			throw new Error(
				`Layout mode '${activeLayoutMode.value}' not supported for tool '${activeTool.value}'`
			)
		}
		return config
	})

	const supportedLayoutModes = computed(() => {
		return currentToolConfig.value.supportedModes
	})

	// Component references
	const activeMainComponent = shallowRef<any>(null)
	const activeMiddleComponent = shallowRef<any>(null)
	const activeRightComponent = shallowRef<any>(null)
	const isLoading = ref(true)

	// Actions
	const setActiveLayoutMode = (mode: LayoutMode) => {
		const supportedModes = currentToolConfig.value.supportedModes
		if (!supportedModes.includes(mode)) {
			console.warn(
				`Layout mode '${mode}' not supported for tool '${activeTool.value}'. Supported modes:`,
				supportedModes
			)
			return
		}
		activeLayoutMode.value = mode
		loadLayoutComponents()
	}

	const loadComponent = async (componentName: string) => {
		if (!componentName || componentName === 'hidden') {
			return null
		}

		const componentLoader = componentPaths[componentName as keyof typeof componentPaths]
		if (!componentLoader) {
			console.error(`Component '${componentName}' not found in componentPaths`)
			return null
		}

		try {
			const module = await componentLoader()
			return markRaw(module.default)
		} catch (error) {
			console.error(`Failed to load component '${componentName}':`, error)
			return null
		}
	}

	const loadLayoutComponents = async () => {
		const config = currentLayoutConfig.value

		try {
			// Load all components in parallel
			const [mainComponent, middleComponent, rightComponent] = await Promise.all([
				loadComponent(config.main),
				loadComponent(config.middle || ''),
				loadComponent(config.right)
			])

			activeMainComponent.value = mainComponent
			activeMiddleComponent.value = middleComponent
			activeRightComponent.value = rightComponent
		} catch (error) {
			console.error('Failed to load layout components:', error)
		}
	}

	const setActiveTool = async (tool: Tool) => {
		isLoading.value = true
		activeTool.value = tool

		// Set default layout mode for the new tool
		const toolConfig = toolLayoutConfigs[tool]
		activeLayoutMode.value = toolConfig.defaultMode

		try {
			// Load all layout components based on current configuration
			await loadLayoutComponents()
		} catch (error) {
			console.error('Failed to load components:', error)
			activeMainComponent.value = null
			activeMiddleComponent.value = null
			activeRightComponent.value = null
		} finally {
			isLoading.value = false
		}
	}

	// Initialize with default tool
	setActiveTool('SeoScore')

	return {
		// State
		activeTool,
		activeLayoutMode,

		// Component instances
		activeMainComponent,
		activeMiddleComponent,
		activeRightComponent,

		// Computed
		currentToolConfig,
		currentLayoutConfig,
		supportedLayoutModes,

		// Loading state
		isLoading,

		// Actions
		setActiveTool,
		setActiveLayoutMode
	}
})
