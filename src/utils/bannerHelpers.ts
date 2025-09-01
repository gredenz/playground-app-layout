import { useBanner } from '@/composables/useBanner'
import type { BannerNotification } from '@/types/banner'

/**
 * Utility functions for showing common banner notifications
 */
export const bannerHelpers = {
  /**
   * Show maintenance notification
   */
  showMaintenance(message?: string) {
    const { showBanner } = useBanner()
    showBanner({
      type: 'maintenance',
      title: 'Scheduled Maintenance',
      message: message || 'System maintenance is scheduled for tonight at 2:00 AM EST. Some features may be temporarily unavailable.',
      dismissible: true,
      persistent: true
    })
  },

  /**
   * Show success notification
   */
  showSuccess(title: string, message?: string) {
    const { showBanner } = useBanner()
    showBanner({
      type: 'success',
      title,
      message,
      dismissible: true,
      autoHide: true,
      autoHideDelay: 4000
    })
  },

  /**
   * Show error notification
   */
  showError(title: string, message?: string) {
    const { showBanner } = useBanner()
    showBanner({
      type: 'error',
      title,
      message,
      dismissible: true,
      persistent: false // Errors should not persist across sessions
    })
  },

  /**
   * Show warning notification
   */
  showWarning(title: string, message?: string) {
    const { showBanner } = useBanner()
    showBanner({
      type: 'warning',
      title,
      message,
      dismissible: true
    })
  },

  /**
   * Show info notification
   */
  showInfo(title: string, message?: string) {
    const { showBanner } = useBanner()
    showBanner({
      type: 'info',
      title,
      message,
      dismissible: true,
      autoHide: true,
      autoHideDelay: 6000
    })
  },

  /**
   * Show custom banner
   */
  showCustom(banner: Omit<BannerNotification, 'id'>) {
    const { showBanner } = useBanner()
    showBanner(banner)
  },

  /**
   * Hide any active banner
   */
  hide() {
    const { hideBanner } = useBanner()
    hideBanner()
  },

  /**
   * Dismiss current banner (will remember dismissal)
   */
  dismiss() {
    const { dismissBanner } = useBanner()
    dismissBanner()
  }
}

// For development and testing convenience
// In production, prefer importing the helpers directly
export default bannerHelpers