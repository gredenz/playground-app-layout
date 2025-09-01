export type ToastSeverity = 'success' | 'info' | 'warn' | 'error'

export interface ToastMessage {
  id: string
  severity: ToastSeverity
  summary: string
  detail?: string
  life?: number // Duration in milliseconds, default is 3000
  sticky?: boolean // If true, toast won't auto-hide
  closable?: boolean // If true, shows close button
}

export type ToastProps = Omit<ToastMessage, 'id'>