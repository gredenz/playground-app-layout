import { shallowRef, type ShallowRef } from 'vue'

// Minimal registry - just enough to prove the concept
export class ToolRegistry {
  private tools = new Map<string, any>() // We'll type this properly later
  private activeTool: ShallowRef<any | null> = shallowRef(null)
  
  register(tool: any) {
    if (this.tools.has(tool.id)) {
      console.warn(`Tool ${tool.id} already registered`)
      return
    }
    
    this.tools.set(tool.id, tool)
    console.log(`Registered tool: ${tool.name}`)
  }
  
  async activate(toolId: string) {
    const tool = this.tools.get(toolId)
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`)
    }
    
    // Deactivate current tool
    if (this.activeTool.value) {
      await this.activeTool.value.onDeactivate?.()
    }
    
    // Activate new tool
    await tool.onActivate?.()
    this.activeTool.value = tool
    
    return tool
  }
  
  getActiveTool() {
    return this.activeTool.value
  }
  
  getAllTools() {
    return Array.from(this.tools.values())
  }
  
  // Get layout configuration for active tool
  getActiveLayout(mode: string) {
    if (!this.activeTool.value) return null
    return this.activeTool.value.layouts[mode]
  }
}

// Singleton for now
export const toolRegistry = new ToolRegistry()