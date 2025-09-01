import { addToast, clearAllToasts } from '@/utils/toastService'
import type { ToastMessage } from '@/types/toast'

/**
 * Utility functions for showing common toast notifications
 */
export const toastHelpers = {
  /**
   * Show success toast
   */
  success(summary: string, detail?: string) {
    addToast({
      severity: 'success',
      summary,
      detail
    })
  },

  /**
   * Show info toast
   */
  info(summary: string, detail?: string) {
    addToast({
      severity: 'info',
      summary,
      detail
    })
  },

  /**
   * Show warning toast
   */
  warn(summary: string, detail?: string) {
    addToast({
      severity: 'warn',
      summary,
      detail
    })
  },

  /**
   * Show error toast (sticky by default)
   */
  error(summary: string, detail?: string) {
    addToast({
      severity: 'error',
      summary,
      detail,
      sticky: true
    })
  },

  /**
   * Show custom toast
   */
  custom(toast: ToastMessage) {
    addToast(toast)
  },

  /**
   * Clear all toasts
   */
  clear() {
    clearAllToasts()
  },

  /**
   * Show operation success toast
   */
  operationSuccess(operation: string, detail?: string) {
    addToast({
      severity: 'success',
      summary: `${operation} Successful`,
      detail: detail || `${operation} completed successfully`
    })
  },

  /**
   * Show operation error toast
   */
  operationError(operation: string, error?: string) {
    addToast({
      severity: 'error',
      summary: `${operation} Failed`,
      detail: error || `Failed to complete ${operation.toLowerCase()}`,
      sticky: true
    })
  },

  /**
   * Show form validation error
   */
  validationError(message: string = 'Please check the form for errors') {
    addToast({
      severity: 'warn',
      summary: 'Validation Error',
      detail: message
    })
  },

  /**
   * Show network error toast
   */
  networkError(detail?: string) {
    addToast({
      severity: 'error',
      summary: 'Network Error',
      detail: detail || 'Please check your internet connection and try again',
      sticky: true
    })
  }
}

// For development and testing convenience
export default toastHelpers