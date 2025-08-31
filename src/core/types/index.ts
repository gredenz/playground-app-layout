/**
 * Core type definitions for the plugin-based tool architecture
 */

import type { Component } from 'vue'

// Layout types
export type LayoutMode = '3col' | '2col' | 'focused'

export type ComponentLoader = () => Promise<{ default: Component }>

export interface LayoutSlots {
  main: ComponentLoader
  middle?: ComponentLoader
  right?: ComponentLoader
}

export interface ToolLayout {
  slots: LayoutSlots
}

// Tool plugin interface
export interface ToolPlugin {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly version?: string
  readonly icon?: string
  
  // Layout configuration
  readonly layouts: Partial<Record<LayoutMode, ToolLayout>>
  readonly defaultLayout: LayoutMode
  
  // Lifecycle hooks
  onActivate?(): Promise<void> | void
  onDeactivate?(): Promise<void> | void
  onDestroy?(): Promise<void> | void
  
  // Tool can expose methods for components to use
  [key: string]: any
}

// Registry interface
export interface ToolRegistryInterface {
  register(tool: ToolPlugin): void
  unregister(toolId: string): void
  activate(toolId: string): Promise<ToolPlugin>
  deactivate(): Promise<void>
  getActiveTool(): ToolPlugin | null
  getAllTools(): ToolPlugin[]
  getToolById(id: string): ToolPlugin | undefined
}

// Tool constructor type for dynamic imports
export type ToolConstructor = new () => ToolPlugin

// Tool module export
export interface ToolModule {
  default: ToolPlugin | ToolConstructor
}