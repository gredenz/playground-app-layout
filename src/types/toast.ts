export type ToastSeverity = 'success' | 'info' | 'warn' | 'error'

export interface ToastMessage {
  severity: ToastSeverity
  summary: string
  detail?: string
  life?: number // Duration in milliseconds, default is 3000
  sticky?: boolean // If true, toast won't auto-hide
  closable?: boolean // If true, shows close button
}

// PrimeVue ToastService interface
export interface PrimeVueToastMessage {
  severity: ToastSeverity
  summary: string
  detail?: string
  life?: number
  closable?: boolean
  group?: string
}

export interface PrimeVueToastService {
  add(message: PrimeVueToastMessage): void
  removeAllGroups(): void
  removeGroup(group: string): void
}

export type ToastProps = ToastMessage