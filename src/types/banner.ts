export type BannerSeverity = 'info' | 'warn' | 'error' | 'success' | 'secondary' | 'contrast'

export interface BannerNotification {
  id: string
  severity: BannerSeverity
  title?: string
  message?: string
  closable?: boolean
  life?: number
  icon?: string
}

export type BannerProps = Omit<BannerNotification, 'id'>