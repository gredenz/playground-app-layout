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
    registry.register(mockTool)
    
    // Should throw error when registering duplicate
    expect(() => registry.register(mockTool)).toThrow('Tool test-tool is already registered')
    
    // Should still only have one tool
    expect(registry.getAllTools()).toHaveLength(1)
  })

  it('should activate a tool and call lifecycle hooks', async () => {
    registry.register(mockTool)
    
    const tool = await registry.activate('test-tool')
    
    expect(tool).toBe(mockTool)
    expect(registry.getActiveTool()).toBe(mockTool)
    expect(mockTool.onActivateCalled).toBe(true)
  })

  it('should deactivate previous tool when activating new one', async () => {
    class MockTool2 implements ToolPlugin {
      readonly id = 'test-tool-2'
      readonly name = 'Test Tool 2'
      readonly description = 'A second test tool'
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
    const mockTool2 = new MockTool2()
    
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

  it('should validate tool has required properties', () => {
    const invalidTool = { id: 'invalid' } as any
    
    expect(() => registry.register(invalidTool)).toThrow('Tool must have id and name')
  })

  it('should validate tool has layouts and defaultLayout', () => {
    const invalidTool = {
      id: 'invalid',
      name: 'Invalid Tool'
    } as any
    
    expect(() => registry.register(invalidTool)).toThrow('Tool invalid must have layouts and defaultLayout')
  })

  it('should validate defaultLayout exists in layouts', () => {
    const invalidTool = {
      id: 'invalid',
      name: 'Invalid Tool',
      layouts: { '2col': {} },
      defaultLayout: '3col' as LayoutMode
    } as any
    
    expect(() => registry.register(invalidTool)).toThrow("Tool invalid: defaultLayout '3col' not found in layouts")
  })

  it('should notify listeners on tool activation', async () => {
    const listener = vi.fn()
    const unsubscribe = registry.onToolChange(listener)
    
    registry.register(mockTool)
    await registry.activate('test-tool')
    
    expect(listener).toHaveBeenCalledWith(mockTool)
    
    // Cleanup
    unsubscribe()
  })

  it('should notify listeners on tool deactivation', async () => {
    const listener = vi.fn()
    registry.onToolChange(listener)
    
    registry.register(mockTool)
    await registry.activate('test-tool')
    await registry.deactivate()
    
    expect(listener).toHaveBeenCalledWith(null)
  })

  it('should allow unsubscribing from tool changes', async () => {
    const listener = vi.fn()
    const unsubscribe = registry.onToolChange(listener)
    
    // Unsubscribe before activation
    unsubscribe()
    
    registry.register(mockTool)
    await registry.activate('test-tool')
    
    // Listener should not have been called
    expect(listener).not.toHaveBeenCalled()
  })
})