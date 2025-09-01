import { ref, readonly } from 'vue'
import type { BannerNotification } from '@/types/banner'

const activeBanner = ref<BannerNotification | null>(null)
const dismissedBanners = ref<string[]>([])
let autoHideTimeout: ReturnType<typeof setTimeout> | null = null
let isInitialized = false

export function useBanner() {
  function showBanner(banner: Omit<BannerNotification, 'id'>) {
    const contentHash = `${banner.type}-${banner.title}-${banner.message || ''}`.replace(/\s+/g, '-').toLowerCase()
    const bannerWithId: BannerNotification = {
      ...banner,
      id: contentHash
    }
    
    if (banner.dismissible !== false && dismissedBanners.value.includes(bannerWithId.id)) {
      return
    }
    
    activeBanner.value = bannerWithId
    
    if (banner.persistent) {
      localStorage.setItem('app-banner', JSON.stringify(bannerWithId))
    }
    
    if (banner.autoHide) {
      clearAutoHideTimeout()
      autoHideTimeout = setTimeout(() => {
        hideBanner()
      }, banner.autoHideDelay || 5000)
    }
  }

  function dismissBanner() {
    if (activeBanner.value) {
      dismissedBanners.value.push(activeBanner.value.id)
      
      if (activeBanner.value.persistent) {
        localStorage.removeItem('app-banner')
      }
      
      clearAutoHideTimeout()
      activeBanner.value = null
    }
  }

  function hideBanner() {
    clearAutoHideTimeout()
    activeBanner.value = null
  }

  function clearAutoHideTimeout() {
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout)
      autoHideTimeout = null
    }
  }

  function loadPersistentBanner() {
    const savedBanner = localStorage.getItem('app-banner')
    if (savedBanner) {
      try {
        const banner = JSON.parse(savedBanner) as BannerNotification
        if (!dismissedBanners.value.includes(banner.id)) {
          activeBanner.value = banner
        }
      } catch (error) {
        console.warn('Failed to load persistent banner:', error)
        localStorage.removeItem('app-banner')
      }
    }
  }

  // Initialize persistent banner loading only once
  if (!isInitialized && typeof window !== 'undefined') {
    isInitialized = true
    loadPersistentBanner()
  }

  // Cleanup will be handled by the component that uses this composable
  // No need for manual cleanup here since timeout is cleared in dismiss/hide functions

  return {
    activeBanner: readonly(activeBanner),
    showBanner,
    dismissBanner,
    hideBanner,
    loadPersistentBanner
  }
}