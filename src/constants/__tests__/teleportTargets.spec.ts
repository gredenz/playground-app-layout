import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { 
  TELEPORT_TARGETS, 
  getTeleportSelector, 
  validateTeleportTargets,
  getAllTeleportTargetIds,
  type TeleportTarget,
  type TeleportTargetId
} from '../teleportTargets'

describe('teleportTargets', () => {
  let testContainer: HTMLElement

  beforeEach(() => {
    testContainer = document.createElement('div')
    document.body.appendChild(testContainer)
  })

  afterEach(() => {
    if (testContainer) {
      document.body.removeChild(testContainer)
    }
  })

  describe('TELEPORT_TARGETS constants', () => {
    it('should define all expected target IDs', () => {
      expect(TELEPORT_TARGETS.APP_BAR_LEFT).toBe('app-bar-left')
      expect(TELEPORT_TARGETS.APP_BAR_ACTIONS).toBe('app-bar-actions')
      expect(TELEPORT_TARGETS.APP_BAR_SETTINGS).toBe('app-bar-settings')
    })

    it('should have immutable properties at runtime', () => {
      // Object.freeze() provides runtime immutability
      expect(() => {
        // @ts-expect-error - testing runtime immutability
        TELEPORT_TARGETS.APP_BAR_LEFT = 'modified'
      }).toThrow()
      
      // Values should remain unchanged
      expect(TELEPORT_TARGETS.APP_BAR_LEFT).toBe('app-bar-left')
      expect(TELEPORT_TARGETS.APP_BAR_ACTIONS).toBe('app-bar-actions')
      expect(TELEPORT_TARGETS.APP_BAR_SETTINGS).toBe('app-bar-settings')
    })

    it('should have consistent naming convention', () => {
      const targetIds = Object.values(TELEPORT_TARGETS)
      targetIds.forEach(id => {
        expect(id).toMatch(/^app-bar-[a-z]+$/)
      })
    })
  })

  describe('getTeleportSelector', () => {
    it('should return correct CSS selector for each target', () => {
      expect(getTeleportSelector('APP_BAR_LEFT')).toBe('#app-bar-left')
      expect(getTeleportSelector('APP_BAR_ACTIONS')).toBe('#app-bar-actions')
      expect(getTeleportSelector('APP_BAR_SETTINGS')).toBe('#app-bar-settings')
    })

    it('should work with TypeScript type checking', () => {
      // This tests compile-time type safety
      const validTarget: TeleportTarget = 'APP_BAR_LEFT'
      expect(getTeleportSelector(validTarget)).toBe('#app-bar-left')
    })
  })

  describe('validateTeleportTargets', () => {
    it('should return false when no targets exist', () => {
      expect(validateTeleportTargets()).toBe(false)
    })

    it('should return false when only some targets exist', () => {
      // Create only one target
      const leftTarget = document.createElement('div')
      leftTarget.id = TELEPORT_TARGETS.APP_BAR_LEFT
      testContainer.appendChild(leftTarget)

      expect(validateTeleportTargets()).toBe(false)
    })

    it('should return true when all targets exist', () => {
      // Create all targets
      Object.values(TELEPORT_TARGETS).forEach(targetId => {
        const target = document.createElement('div')
        target.id = targetId
        testContainer.appendChild(target)
      })

      expect(validateTeleportTargets()).toBe(true)
    })

    it('should handle DOM changes dynamically', () => {
      // Create all targets
      const targets: HTMLElement[] = []
      Object.values(TELEPORT_TARGETS).forEach(targetId => {
        const target = document.createElement('div')
        target.id = targetId
        testContainer.appendChild(target)
        targets.push(target)
      })

      expect(validateTeleportTargets()).toBe(true)

      // Remove one target
      targets[0].remove()
      expect(validateTeleportTargets()).toBe(false)

      // Add it back
      testContainer.appendChild(targets[0])
      expect(validateTeleportTargets()).toBe(true)
    })
  })

  describe('getAllTeleportTargetIds', () => {
    it('should return all target IDs', () => {
      const ids = getAllTeleportTargetIds()
      expect(ids).toHaveLength(3)
      expect(ids).toContain('app-bar-left')
      expect(ids).toContain('app-bar-actions')
      expect(ids).toContain('app-bar-settings')
    })

    it('should return a new array each time', () => {
      const ids1 = getAllTeleportTargetIds()
      const ids2 = getAllTeleportTargetIds()
      
      expect(ids1).not.toBe(ids2) // Different array instances
      expect(ids1).toEqual(ids2)   // But same content
    })

    it('should maintain correct TypeScript types', () => {
      const ids: TeleportTargetId[] = getAllTeleportTargetIds()
      ids.forEach(id => {
        expect(typeof id).toBe('string')
        expect(Object.values(TELEPORT_TARGETS)).toContain(id)
      })
    })
  })

  describe('Type safety', () => {
    it('should enforce correct target types at compile time', () => {
      // These should compile without errors
      const target1: TeleportTarget = 'APP_BAR_LEFT'
      const target2: TeleportTarget = 'APP_BAR_ACTIONS'
      const target3: TeleportTarget = 'APP_BAR_SETTINGS'

      expect([target1, target2, target3]).toHaveLength(3)
    })

    it('should enforce correct ID types at compile time', () => {
      // These should compile without errors
      const id1: TeleportTargetId = 'app-bar-left'
      const id2: TeleportTargetId = 'app-bar-actions'  
      const id3: TeleportTargetId = 'app-bar-settings'

      expect([id1, id2, id3]).toHaveLength(3)
    })
  })

  describe('Integration scenarios', () => {
    it('should work with real DOM structure', () => {
      // Simulate the actual AppBar structure
      testContainer.innerHTML = `
        <header class="app-bar">
          <div class="container">
            <div class="flex">
              <div class="left-section">
                <div id="${TELEPORT_TARGETS.APP_BAR_LEFT}" class="flex items-center"></div>
              </div>
              <div class="right-section">
                <div id="${TELEPORT_TARGETS.APP_BAR_ACTIONS}" class="flex items-center"></div>
                <div class="tool-selector"></div>
                <div id="${TELEPORT_TARGETS.APP_BAR_SETTINGS}" class="flex items-center"></div>
              </div>
            </div>
          </div>
        </header>
      `

      expect(validateTeleportTargets()).toBe(true)

      // Test that we can query each target
      getAllTeleportTargetIds().forEach(targetId => {
        const element = document.getElementById(targetId)
        expect(element).toBeTruthy()
        expect(element?.classList.contains('flex')).toBe(true)
      })
    })
  })
})