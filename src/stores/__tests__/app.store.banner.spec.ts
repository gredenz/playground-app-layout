import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '../app.store'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
vi.stubGlobal('localStorage', localStorageMock)

describe('App Store - Banner functionality', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('showBanner', () => {
    it('should show a banner with generated content-based ID', () => {
      const appStore = useAppStore()
      
      appStore.showBanner({
        type: 'info',
        title: 'Test Banner',
        message: 'Test message'
      })

      expect(appStore.activeBanner).not.toBeNull()
      expect(appStore.activeBanner?.type).toBe('info')
      expect(appStore.activeBanner?.title).toBe('Test Banner')
      expect(appStore.activeBanner?.message).toBe('Test message')
      expect(appStore.activeBanner?.id).toBe('info-test-banner-test-message')
    })

    it('should generate consistent IDs for same content', () => {
      const appStore = useAppStore()
      
      const banner = {
        type: 'warning' as const,
        title: 'Same Content',
        message: 'Same Message'
      }

      appStore.showBanner(banner)
      const firstId = appStore.activeBanner?.id

      appStore.hideBanner()
      appStore.showBanner(banner)
      const secondId = appStore.activeBanner?.id

      expect(firstId).toBe(secondId)
    })

    it('should normalize spaces in ID generation', () => {
      const appStore = useAppStore()
      
      appStore.showBanner({
        type: 'info',
        title: 'Title With   Multiple    Spaces',
        message: 'Message  with   spaces'
      })

      expect(appStore.activeBanner?.id).toBe('info-title-with-multiple-spaces-message-with-spaces')
    })

    it('should save persistent banners to localStorage', () => {
      const appStore = useAppStore()
      
      const persistentBanner = {
        type: 'maintenance' as const,
        title: 'Maintenance',
        persistent: true
      }

      appStore.showBanner(persistentBanner)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'app-banner',
        JSON.stringify({
          ...persistentBanner,
          id: 'maintenance-maintenance-'
        })
      )
    })

    it('should not show previously dismissed banners', () => {
      const appStore = useAppStore()
      
      const banner = {
        type: 'info' as const,
        title: 'Test Banner'
      }

      // Show banner first time
      appStore.showBanner(banner)
      expect(appStore.activeBanner).not.toBeNull()

      // Dismiss it
      appStore.dismissBanner()
      expect(appStore.activeBanner).toBeNull()

      // Try to show same banner again
      appStore.showBanner(banner)
      expect(appStore.activeBanner).toBeNull() // Should not show again
    })

    it('should show non-dismissible banners even if previously dismissed', () => {
      const appStore = useAppStore()
      
      const banner = {
        type: 'error' as const,
        title: 'Critical Error',
        dismissible: false
      }

      // Show and dismiss
      appStore.showBanner(banner)
      appStore.dismissBanner()

      // Should show again because it's not dismissible
      appStore.showBanner(banner)
      expect(appStore.activeBanner).not.toBeNull()
    })
  })

  describe('dismissBanner', () => {
    it('should dismiss active banner and track dismissal', () => {
      const appStore = useAppStore()
      
      appStore.showBanner({
        type: 'info',
        title: 'Test Banner'
      })

      const bannerId = appStore.activeBanner?.id
      expect(appStore.activeBanner).not.toBeNull()

      appStore.dismissBanner()

      expect(appStore.activeBanner).toBeNull()
      expect(appStore.dismissedBanners).toContain(bannerId)
    })

    it('should remove persistent banner from localStorage on dismiss', () => {
      const appStore = useAppStore()
      
      appStore.showBanner({
        type: 'maintenance',
        title: 'Maintenance',
        persistent: true
      })

      appStore.dismissBanner()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('app-banner')
    })

    it('should do nothing if no active banner', () => {
      const appStore = useAppStore()
      
      expect(() => appStore.dismissBanner()).not.toThrow()
      expect(appStore.activeBanner).toBeNull()
    })
  })

  describe('hideBanner', () => {
    it('should hide active banner without tracking dismissal', () => {
      const appStore = useAppStore()
      
      appStore.showBanner({
        type: 'info',
        title: 'Test Banner'
      })

      expect(appStore.activeBanner).not.toBeNull()

      appStore.hideBanner()

      expect(appStore.activeBanner).toBeNull()
      expect(appStore.dismissedBanners).toHaveLength(0)
    })
  })

  describe('loadPersistentBanner', () => {
    it('should load valid persistent banner from localStorage', () => {
      const savedBanner = {
        id: 'maintenance-test-',
        type: 'maintenance',
        title: 'Test Maintenance',
        persistent: true
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedBanner))

      const appStore = useAppStore()
      appStore.loadPersistentBanner()

      expect(appStore.activeBanner).toEqual(savedBanner)
    })

    it('should not load previously dismissed persistent banner', () => {
      const savedBanner = {
        id: 'maintenance-test-',
        type: 'maintenance',
        title: 'Test Maintenance',
        persistent: true
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedBanner))

      const appStore = useAppStore()
      // Simulate previous dismissal
      appStore.dismissedBanners.push(savedBanner.id)
      
      appStore.loadPersistentBanner()

      expect(appStore.activeBanner).toBeNull()
    })

    it('should handle invalid JSON in localStorage gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      const appStore = useAppStore()
      
      expect(() => appStore.loadPersistentBanner()).not.toThrow()
      expect(appStore.activeBanner).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('app-banner')
    })

    it('should do nothing if no banner in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const appStore = useAppStore()
      
      expect(() => appStore.loadPersistentBanner()).not.toThrow()
      expect(appStore.activeBanner).toBeNull()
    })
  })

  describe('Banner type validation', () => {
    it('should accept all valid banner types', () => {
      const appStore = useAppStore()
      const types = ['info', 'warning', 'error', 'success', 'maintenance'] as const

      types.forEach(type => {
        appStore.showBanner({
          type,
          title: `${type} banner`
        })

        expect(appStore.activeBanner?.type).toBe(type)
        appStore.hideBanner()
      })
    })
  })
})