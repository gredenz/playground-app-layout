import { useToast } from '@/composables/useToast'
import type { ToastMessage } from '@/types/toast'

/**
 * Utility functions for showing common toast notifications
 */
export const toastHelpers = {
  /**
   * Show success toast
   */
  success(summary: string, detail?: string) {
    const { success } = useToast()
    success(summary, detail)
  },

  /**
   * Show info toast
   */
  info(summary: string, detail?: string) {
    const { info } = useToast()
    info(summary, detail)
  },

  /**
   * Show warning toast
   */
  warn(summary: string, detail?: string) {
    const { warn } = useToast()
    warn(summary, detail)
  },

  /**
   * Show error toast (sticky by default)
   */
  error(summary: string, detail?: string) {
    const { error } = useToast()
    error(summary, detail)
  },

  /**
   * Show custom toast
   */
  custom(toast: Omit<ToastMessage, 'id'>) {
    const { addToast } = useToast()
    addToast(toast)
  },

  /**
   * Clear all toasts
   */
  clear() {
    const { clearAllToasts } = useToast()
    clearAllToasts()
  },

  /**
   * Show operation success toast
   */
  operationSuccess(operation: string, detail?: string) {
    const { success } = useToast()
    success(`${operation} Successful`, detail || `${operation} completed successfully`)
  },

  /**
   * Show operation error toast
   */
  operationError(operation: string, error?: string) {
    const { error: showError } = useToast()
    showError(`${operation} Failed`, error || `Failed to complete ${operation.toLowerCase()}`)
  },

  /**
   * Show form validation error
   */
  validationError(message: string = 'Please check the form for errors') {
    const { warn } = useToast()
    warn('Validation Error', message)
  },

  /**
   * Show network error toast
   */
  networkError(detail?: string) {
    const { error } = useToast()
    error('Network Error', detail || 'Please check your internet connection and try again')
  }
}

// For development and testing convenience
export default toastHelpers