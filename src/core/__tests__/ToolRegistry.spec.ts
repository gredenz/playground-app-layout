import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ToolRegistry } from '../ToolRegistry'
import type { ToolPlugin, LayoutMode } from '../types'

// Mock tool for testing
class MockTool implements ToolPlugin {
  readonly id = 'test-tool'
  readonly name = 'Test Tool'
  readonly description = 'A test tool'
  readonly defaultLayout: LayoutMode = '2col'
  readonly layouts = {
    '2col': {
      slots: {
        main: () => Promise.resolve({ default: {} as any }),
        right: () => Promise.resolve({ default: {} as any })
      }
    }
  }

  onActivateCalled = false
  onDeactivateCalled = false

  async onActivate() {
    this.onActivateCalled = true
  }

  async onDeactivate() {
    this.onDeactivateCalled = true
  }
}

describe('ToolRegistry', () => {
  let registry: ToolRegistry
  let mockTool: MockTool

  beforeEach(() => {
    registry = new ToolRegistry()
    mockTool = new MockTool()
  })

  it('should register a tool', () => {
    registry.register(mockTool)
    
    expect(registry.getAllTools()).toHaveLength(1)
    expect(registry.getToolById('test-tool')).toBe(mockTool)
  })

  it('should prevent duplicate registration', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    registry.register(mockTool)
    registry.register(mockTool)
    
    expect(registry.getAllTools()).toHaveLength(1)
    expect(consoleSpy).toHaveBeenCalledWith('Tool test-tool already registered')
    
    consoleSpy.mockRestore()
  })

  it('should activate a tool and call lifecycle hooks', async () => {
    registry.register(mockTool)
    
    const tool = await registry.activate('test-tool')
    
    expect(tool).toBe(mockTool)
    expect(registry.getActiveTool()).toBe(mockTool)
    expect(mockTool.onActivateCalled).toBe(true)
  })

  it('should deactivate previous tool when activating new one', async () => {
    const mockTool2 = new MockTool()
    mockTool2.id = 'test-tool-2'
    
    registry.register(mockTool)
    registry.register(mockTool2)
    
    await registry.activate('test-tool')
    expect(mockTool.onActivateCalled).toBe(true)
    
    await registry.activate('test-tool-2')
    expect(mockTool.onDeactivateCalled).toBe(true)
    expect(registry.getActiveTool()).toBe(mockTool2)
  })

  it('should throw error for unknown tool', async () => {
    await expect(registry.activate('unknown')).rejects.toThrow('Tool unknown not found')
  })

  it('should unregister tools properly', () => {
    registry.register(mockTool)
    registry.unregister('test-tool')
    
    expect(registry.getAllTools()).toHaveLength(0)
    expect(registry.getToolById('test-tool')).toBeUndefined()
  })
})