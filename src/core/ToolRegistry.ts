import { shallowRef, ref, type ShallowRef, type Ref } from 'vue'
import type { ToolPlugin, ToolRegistryInterface } from './types'

export class ToolRegistry implements ToolRegistryInterface {
  private tools = new Map<string, ToolPlugin>()
  private activeTool: ShallowRef<ToolPlugin | null> = shallowRef(null)
  // Make tools list reactive so computed properties update
  private toolsList: Ref<ToolPlugin[]> = ref([])
  // Simple event listeners for tool changes
  private listeners = new Set<(tool: ToolPlugin | null) => void>()
  
  /**
   * Validates that a tool has all required properties
   */
  private validateTool(tool: ToolPlugin): void {
    if (!tool.id || !tool.name) {
      throw new Error('Tool must have id and name')
    }
    if (!tool.layouts || !tool.defaultLayout) {
      throw new Error(`Tool ${tool.id} must have layouts and defaultLayout`)
    }
    if (!tool.layouts[tool.defaultLayout]) {
      throw new Error(`Tool ${tool.id}: defaultLayout '${tool.defaultLayout}' not found in layouts`)
    }
  }
  
  register(tool: ToolPlugin): void {
    // Validate tool structure
    this.validateTool(tool)
    
    // Check for duplicates
    if (this.tools.has(tool.id)) {
      throw new Error(`Tool ${tool.id} is already registered`)
    }
    
    this.tools.set(tool.id, tool)
    this.toolsList.value = Array.from(this.tools.values()) // Update reactive list
    console.log(`Registered tool: ${tool.name}`)
  }
  
  unregister(toolId: string): void {
    const tool = this.tools.get(toolId)
    if (tool && this.activeTool.value?.id === toolId) {
      this.deactivate()
    }
    this.tools.delete(toolId)
    this.toolsList.value = Array.from(this.tools.values()) // Update reactive list
  }
  
  async activate(toolId: string): Promise<ToolPlugin> {
    const tool = this.tools.get(toolId)
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`)
    }
    
    // Deactivate current tool
    await this.deactivate()
    
    // Activate new tool
    await tool.onActivate?.()
    this.activeTool.value = tool
    
    // Notify listeners
    this.notifyListeners(tool)
    
    return tool
  }
  
  async deactivate(): Promise<void> {
    if (this.activeTool.value) {
      await this.activeTool.value.onDeactivate?.()
      this.activeTool.value = null
      
      // Notify listeners that no tool is active
      this.notifyListeners(null)
    }
  }
  
  /**
   * Subscribe to tool change events
   * Returns a cleanup function to unsubscribe
   */
  onToolChange(callback: (tool: ToolPlugin | null) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }
  
  private notifyListeners(tool: ToolPlugin | null): void {
    this.listeners.forEach(callback => callback(tool))
  }
  
  getActiveTool(): ToolPlugin | null {
    return this.activeTool.value
  }
  
  getAllTools(): ToolPlugin[] {
    return this.toolsList.value // Return the reactive array
  }
  
  getToolById(id: string): ToolPlugin | undefined {
    return this.tools.get(id)
  }
}

// Singleton for now
export const toolRegistry = new ToolRegistry()