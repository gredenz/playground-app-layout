import { useAppStore, type BannerNotification } from '@/stores/app.store'

/**
 * Utility functions for showing common banner notifications
 */
export const bannerHelpers = {
  /**
   * Show maintenance notification
   */
  showMaintenance(message?: string) {
    const appStore = useAppStore()
    appStore.showBanner({
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
    const appStore = useAppStore()
    appStore.showBanner({
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
    const appStore = useAppStore()
    appStore.showBanner({
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
    const appStore = useAppStore()
    appStore.showBanner({
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
    const appStore = useAppStore()
    appStore.showBanner({
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
    const appStore = useAppStore()
    appStore.showBanner(banner)
  },

  /**
   * Hide any active banner
   */
  hide() {
    const appStore = useAppStore()
    appStore.hideBanner()
  },

  /**
   * Dismiss current banner (will remember dismissal)
   */
  dismiss() {
    const appStore = useAppStore()
    appStore.dismissBanner()
  }
}

// Make available globally for easy testing
if (typeof window !== 'undefined') {
  ;(window as any).bannerHelpers = bannerHelpers
}