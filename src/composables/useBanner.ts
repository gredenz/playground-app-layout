import { ref, readonly } from 'vue'
import type { BannerNotification } from '@/types/banner'

const activeBanner = ref<BannerNotification | null>(null)
const dismissedBanners = ref<string[]>([])
let autoHideTimeout: ReturnType<typeof setTimeout> | null = null

export function useBanner() {
  function showBanner(banner: Omit<BannerNotification, 'id'>) {
    const contentHash = `${banner.severity}-${banner.title || ''}-${banner.message || ''}`.replace(/\s+/g, '-').toLowerCase()
    const bannerWithId: BannerNotification = {
      ...banner,
      id: contentHash
    }
    
    if (banner.closable !== false && dismissedBanners.value.includes(bannerWithId.id)) {
      return
    }
    
    activeBanner.value = bannerWithId
    
    if (banner.life && banner.life > 0) {
      clearAutoHideTimeout()
      autoHideTimeout = setTimeout(() => {
        hideBanner()
      }, banner.life)
    }
  }

  function dismissBanner() {
    if (activeBanner.value) {
      dismissedBanners.value.push(activeBanner.value.id)
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

  return {
    activeBanner: readonly(activeBanner),
    showBanner,
    dismissBanner,
    hideBanner
  }
}