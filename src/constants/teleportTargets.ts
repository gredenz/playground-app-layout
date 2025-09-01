/**
 * Teleport target constants for AppBar integration
 * These define where plugin components can inject their UI elements
 */
export const TELEPORT_TARGETS = Object.freeze({
  /** Left side of AppBar, after navigation links */
  APP_BAR_LEFT: 'app-bar-left',
  
  /** Right side of AppBar, before tool selector - for primary actions */
  APP_BAR_ACTIONS: 'app-bar-actions',
  
  /** Right side of AppBar, between tool selector and user menu - for settings */
  APP_BAR_SETTINGS: 'app-bar-settings'
} as const)

export type TeleportTarget = keyof typeof TELEPORT_TARGETS
export type TeleportTargetId = typeof TELEPORT_TARGETS[TeleportTarget]

/**
 * Helper function to get teleport target selector
 */
export const getTeleportSelector = (target: TeleportTarget): string => {
  return `#${TELEPORT_TARGETS[target]}`
}

/**
 * Validate that all required teleport targets exist in the DOM
 */
export const validateTeleportTargets = (): boolean => {
  return Object.values(TELEPORT_TARGETS).every(targetId => {
    const element = document.getElementById(targetId)
    return element !== null
  })
}

/**
 * Get all available teleport target IDs
 */
export const getAllTeleportTargetIds = (): TeleportTargetId[] => {
  return Object.values(TELEPORT_TARGETS)
}