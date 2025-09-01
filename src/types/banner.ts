export type BannerType = 'info' | 'warning' | 'error' | 'success' | 'maintenance'

export interface BannerNotification {
  id: string
  type: BannerType
  title: string
  message?: string
  dismissible?: boolean
  autoHide?: boolean
  autoHideDelay?: number
  persistent?: boolean // Survives page refresh
}

export type BannerProps = Omit<BannerNotification, 'id' | 'persistent'>