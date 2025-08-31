import { shallowRef, ref, type ShallowRef, type Ref } from 'vue'
import type { ToolPlugin, ToolRegistryInterface } from './types'

export class ToolRegistry implements ToolRegistryInterface {
  private tools = new Map<string, ToolPlugin>()
  private activeTool: ShallowRef<ToolPlugin | null> = shallowRef(null)
  // Make tools list reactive so computed properties update
  private toolsList: Ref<ToolPlugin[]> = ref([])
  
  register(tool: ToolPlugin): void {
    if (this.tools.has(tool.id)) {
      console.warn(`Tool ${tool.id} already registered`)
      return
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
    
    return tool
  }
  
  async deactivate(): Promise<void> {
    if (this.activeTool.value) {
      await this.activeTool.value.onDeactivate?.()
      this.activeTool.value = null
    }
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