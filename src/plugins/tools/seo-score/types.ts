// Local types for now, we'll extract common ones later
export type LayoutMode = '3col' | '2col' | 'focused'

export type SlotComponent = () => Promise<any> // Will improve type later

export interface LayoutSlots {
  main: SlotComponent
  middle?: SlotComponent
  right?: SlotComponent
}

export interface ToolLayout {
  slots: LayoutSlots
}