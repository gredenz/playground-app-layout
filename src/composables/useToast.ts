import { getCurrentInstance } from 'vue'
import type { ToastMessage, PrimeVueToastService } from '@/types/toast'

export function useToast() {
  const instance = getCurrentInstance()
  const toast = instance?.appContext.config.globalProperties.$toast as PrimeVueToastService

  if (!toast) {
    console.warn('Toast service not available. Make sure ToastService is registered.')
    // Return mock functions for graceful degradation
    return {
      addToast: () => {},
      removeToast: () => {},
      clearAllToasts: () => {},
      success: () => {},
      info: () => {},
      warn: () => {},
      error: () => {}
    }
  }

  function addToast(message: ToastMessage) {
    toast!.add({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      life: message.sticky ? 0 : (message.life ?? 3000),
      closable: message.closable ?? true
    })
  }

  function removeToast(id?: string) {
    if (id) {
      toast!.removeGroup(id)
    } else {
      toast!.removeAllGroups()
    }
  }

  function clearAllToasts() {
    toast!.removeAllGroups()
  }

  // Convenience methods for common severities
  function success(summary: string, detail?: string, options?: Partial<ToastMessage>) {
    addToast({
      severity: 'success',
      summary,
      detail,
      ...options
    })
  }

  function info(summary: string, detail?: string, options?: Partial<ToastMessage>) {
    addToast({
      severity: 'info',
      summary,
      detail,
      ...options
    })
  }

  function warn(summary: string, detail?: string, options?: Partial<ToastMessage>) {
    addToast({
      severity: 'warn',
      summary,
      detail,
      ...options
    })
  }

  function error(summary: string, detail?: string, options?: Partial<ToastMessage>) {
    addToast({
      severity: 'error',
      summary,
      detail,
      sticky: true, // Error toasts are sticky by default
      ...options
    })
  }

  return {
    addToast,
    removeToast,
    clearAllToasts,
    success,
    info,
    warn,
    error
  }
}