import { BaseTool } from '@/core/BaseTool'
import type { LayoutMode, ToolLayout } from '@/core/types'

export class DebugTool extends BaseTool {
  readonly id = 'debug-tool'
  readonly name = 'Debug Tool'
  readonly description = 'System debugging and diagnostic information'

  readonly layouts: Partial<Record<LayoutMode, ToolLayout>> = {
    '3col': {
      slots: {
        main: () => import('./components/DebugMainPanel.vue'),
        middle: () => import('./components/DebugMiddlePanel.vue'),
        right: () => import('@/components/shared/ToolList.vue')
      }
    },
    '2col': {
      slots: {
        main: () => import('./components/DebugMainPanel.vue'),
        right: () => import('@/components/shared/ToolList.vue')
      }
    },
    'focused': {
      slots: {
        main: () => import('./components/DebugMainPanel.vue')
      }
    }
  }

  readonly defaultLayout: LayoutMode = '2col'

  async onActivate() {
    console.log(`Tool ${this.name} activated`)
    this.validateLayouts()
  }

  async onDeactivate() {
    console.log(`Tool ${this.name} deactivated`)
  }

  // Factory method for plugin registration
  static install() {
    return new DebugTool()
  }
}

// Export instance for plugin registration
export default DebugTool.install()
