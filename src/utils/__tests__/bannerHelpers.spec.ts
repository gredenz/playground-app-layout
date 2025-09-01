import { describe, it, expect, vi, beforeEach } from 'vitest'
import { bannerHelpers } from '../bannerHelpers'
import { useBanner } from '@/composables/useBanner'

// Mock the banner composable
vi.mock('@/composables/useBanner', () => ({
  useBanner: vi.fn()
}))

type MockBannerComposable = any

describe('bannerHelpers', () => {
  let mockBannerComposable: MockBannerComposable

  beforeEach(() => {
    mockBannerComposable = {
      showBanner: vi.fn(),
      hideBanner: vi.fn(),
      dismissBanner: vi.fn(),
      activeBanner: {value: null},
    }

    vi.mocked(useBanner).mockReturnValue(mockBannerComposable)
  })

  describe('showMaintenance', () => {
    it('should show maintenance banner with default message', () => {
      bannerHelpers.showMaintenance()

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        severity: 'secondary',
        title: 'Scheduled Maintenance',
        message: 'System maintenance is scheduled for tonight at 2:00 AM EST. Some features may be temporarily unavailable.',
        closable: true
      })
    })

    it('should show maintenance banner with custom message', () => {
      const customMessage = 'Custom maintenance message'
      bannerHelpers.showMaintenance(customMessage)

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        severity: 'secondary',
        title: 'Scheduled Maintenance',
        message: customMessage,
        closable: true
      })
    })
  })

  describe('showSuccess', () => {
    it('should show success banner with auto-hide', () => {
      bannerHelpers.showSuccess('Operation Complete', 'Your action was successful')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        severity: 'success',
        title: 'Operation Complete',
        message: 'Your action was successful',
        closable: true,
        life: 4000
      })
    })

    it('should show success banner without message', () => {
      bannerHelpers.showSuccess('Success!')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        severity: 'success',
        title: 'Success!',
        message: undefined,
        closable: true,
        life: 4000
      })
    })
  })

  describe('showError', () => {
    it('should show error banner', () => {
      bannerHelpers.showError('Error Occurred', 'Something went wrong')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        severity: 'error',
        title: 'Error Occurred',
        message: 'Something went wrong',
        closable: true
      })
    })

    it('should show error banner without message', () => {
      bannerHelpers.showError('Critical Error')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        severity: 'error',
        title: 'Critical Error',
        message: undefined,
        closable: true
      })
    })
  })

  describe('showWarning', () => {
    it('should show warning banner', () => {
      bannerHelpers.showWarning('Warning Title', 'Warning message')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        severity: 'warn',
        title: 'Warning Title',
        message: 'Warning message',
        closable: true
      })
    })
  })

  describe('showInfo', () => {
    it('should show info banner with auto-hide', () => {
      bannerHelpers.showInfo('Information', 'Some helpful info')

      expect(mockBannerComposable.showBanner).toHaveBeenCalledWith({
        severity: 'info',
        title: 'Information',
        message: 'Some helpful info',
        closable: true,
        life: 6000
      })
    })
  })

  describe('showCustom', () => {
    it('should show custom banner with provided configuration', () => {
      const customBanner = {
        severity: 'warn' as const,
        title: 'Custom Banner',
        message: 'Custom message',
        closable: false,
        life: 2000
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
