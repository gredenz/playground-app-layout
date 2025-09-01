// Plugin bootstrap - this is where we'll auto-discover and register tools
import { toolRegistry } from '@/core/ToolRegistry'
import SeoScoreTool from './tools/seo-score'
import DebugTool from './tools/debug-tool'

export function registerAllTools() {
  // For now, manual registration
  // Later this could scan the tools directory
  toolRegistry.register(SeoScoreTool)
  toolRegistry.register(DebugTool)
  
  // We could add more tools here as we create them
  // toolRegistry.register(SpecSheetTool)
}