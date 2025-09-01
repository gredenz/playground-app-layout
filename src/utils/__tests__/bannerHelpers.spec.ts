import { describe, it, expect, vi, beforeEach } from 'vitest'
import { bannerHelpers } from '../bannerHelpers'
import { useBanner } from '@/composables/useBanner'

// Mock the banner composable
vi.mock('@/composables/useBanner', () => ({
  useBanner: vi.fn()
}))

describe('bannerHelpers', () => {
  let mockBannerComposable: any

  beforeEach(() => {
    mockBannerComposable = {
      showBanner: vi.fn(),
      hideBanner: vi.fn(),
      dismissBanner: vi.fn()
    }
    
    vi.mocked(useBanner).mockReturnValue(mockBannerComposable)
  })

  describe('showMaintenance', () => {
    it('should show maintenance banner with default message', () => {
      bannerHelpers.showMaintenance()

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        type: 'maintenance',
        title: 'Scheduled Maintenance',
        message: 'System maintenance is scheduled for tonight at 2:00 AM EST. Some features may be temporarily unavailable.',
        dismissible: true,
        persistent: true
      })
    })

    it('should show maintenance banner with custom message', () => {
      const customMessage = 'Custom maintenance message'
      bannerHelpers.showMaintenance(customMessage)

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        type: 'maintenance',
        title: 'Scheduled Maintenance',
        message: customMessage,
        dismissible: true,
        persistent: true
      })
    })
  })

  describe('showSuccess', () => {
    it('should show success banner with auto-hide', () => {
      bannerHelpers.showSuccess('Operation Complete', 'Your action was successful')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        type: 'success',
        title: 'Operation Complete',
        message: 'Your action was successful',
        dismissible: true,
        autoHide: true,
        autoHideDelay: 4000
      })
    })

    it('should show success banner without message', () => {
      bannerHelpers.showSuccess('Success!')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        type: 'success',
        title: 'Success!',
        message: undefined,
        dismissible: true,
        autoHide: true,
        autoHideDelay: 4000
      })
    })
  })

  describe('showError', () => {
    it('should show error banner that is not persistent', () => {
      bannerHelpers.showError('Error Occurred', 'Something went wrong')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error Occurred',
        message: 'Something went wrong',
        dismissible: true,
        persistent: false
      })
    })

    it('should show error banner without message', () => {
      bannerHelpers.showError('Critical Error')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        type: 'error',
        title: 'Critical Error',
        message: undefined,
        dismissible: true,
        persistent: false
      })
    })
  })

  describe('showWarning', () => {
    it('should show warning banner', () => {
      bannerHelpers.showWarning('Warning Title', 'Warning message')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        type: 'warning',
        title: 'Warning Title',
        message: 'Warning message',
        dismissible: true
      })
    })
  })

  describe('showInfo', () => {
    it('should show info banner with auto-hide', () => {
      bannerHelpers.showInfo('Information', 'Some helpful info')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        type: 'info',
        title: 'Information',
        message: 'Some helpful info',
        dismissible: true,
        autoHide: true,
        autoHideDelay: 6000
      })
    })
  })

  describe('showCustom', () => {
    it('should show custom banner with provided configuration', () => {
      const customBanner = {
        type: 'warning' as const,
        title: 'Custom Banner',
        message: 'Custom message',
        dismissible: false,
        autoHide: true,
        autoHideDelay: 2000,
        persistent: true
      }

      bannerHelpers.showCustom(customBanner)

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith(customBanner)
    })
  })

  describe('hide', () => {
    it('should call hideBanner on store', () => {
      bannerHelpers.hide()

      expect(mockBannerComposable.hideBanner).toHaveBeenCalled()
    })
  })

  describe('dismiss', () => {
    it('should call dismissBanner on store', () => {
      bannerHelpers.dismiss()

      expect(mockBannerComposable.dismissBanner).toHaveBeenCalled()
    })
  })
})