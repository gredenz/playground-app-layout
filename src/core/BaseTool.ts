import type { ToolPlugin, LayoutMode, ToolLayout } from './types'

/**
 * Base class for tool plugins
 * Provides common functionality and ensures interface compliance
 */
export abstract class BaseTool implements ToolPlugin {
  abstract readonly id: string
  abstract readonly name: string
  abstract readonly description?: string
  
  readonly version: string = '1.0.0'
  readonly icon?: string
  
  abstract readonly layouts: Partial<Record<LayoutMode, ToolLayout>>
  abstract readonly defaultLayout: LayoutMode
  
  // Default lifecycle implementations (can be overridden)
  async onActivate(): Promise<void> {
    // Override in subclass if needed
  }
  
  async onDeactivate(): Promise<void> {
    // Override in subclass if needed
  }
  
  async onDestroy(): Promise<void> {
    // Override in subclass if needed
  }
  
  // Helper method for subclasses
  protected validateLayouts(): void {
    if (!this.layouts[this.defaultLayout]) {
      throw new Error(
        `Tool ${this.id}: default layout '${this.defaultLayout}' not found in layouts`
      )
    }
  }
}