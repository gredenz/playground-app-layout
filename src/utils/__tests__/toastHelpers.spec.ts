import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toastHelpers } from '../toastHelpers'
import { useToast } from '@/composables/useToast'

// Mock the toast composable
vi.mock('@/composables/useToast', () => ({
  useToast: vi.fn()
}))

describe('toastHelpers', () => {
  let mockToastComposable: any

  beforeEach(() => {
    mockToastComposable = {
      success: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      addToast: vi.fn(),
      clearAllToasts: vi.fn()
    }
    
    vi.mocked(useToast).mockReturnValue(mockToastComposable)
  })

  describe('success', () => {
    it('should show success toast with summary and detail', () => {
      toastHelpers.success('Operation Complete', 'Data saved successfully')

      expect(mockToastComposable.success).toHaveBeenCalledWith(
        'Operation Complete',
        'Data saved successfully'
      )
    })

    it('should show success toast with summary only', () => {
      toastHelpers.success('Success!')

      expect(mockToastComposable.success).toHaveBeenCalledWith(
        'Success!',
        undefined
      )
    })
  })

  describe('info', () => {
    it('should show info toast', () => {
      toastHelpers.info('Information', 'Here is some info')

      expect(mockToastComposable.info).toHaveBeenCalledWith(
        'Information',
        'Here is some info'
      )
    })
  })

  describe('warn', () => {
    it('should show warning toast', () => {
      toastHelpers.warn('Warning', 'Be careful')

      expect(mockToastComposable.warn).toHaveBeenCalledWith(
        'Warning',
        'Be careful'
      )
    })
  })

  describe('error', () => {
    it('should show error toast', () => {
      toastHelpers.error('Error', 'Something went wrong')

      expect(mockToastComposable.error).toHaveBeenCalledWith(
        'Error',
        'Something went wrong'
      )
    })
  })

  describe('custom', () => {
    it('should show custom toast with provided configuration', () => {
      const customToast = {
        severity: 'warn' as const,
        summary: 'Custom Toast',
        detail: 'Custom message',
        life: 5000,
        sticky: false
      }

      toastHelpers.custom(customToast)

      expect(mockToastComposable.addToast).toHaveBeenCalledWith(customToast)
    })
  })

  describe('clear', () => {
    it('should clear all toasts', () => {
      toastHelpers.clear()

      expect(mockToastComposable.clearAllToasts).toHaveBeenCalled()
    })
  })

  describe('operationSuccess', () => {
    it('should show operation success toast with default detail', () => {
      toastHelpers.operationSuccess('File Upload')

      expect(mockToastComposable.success).toHaveBeenCalledWith(
        'File Upload Successful',
        'File Upload completed successfully'
      )
    })

    it('should show operation success toast with custom detail', () => {
      toastHelpers.operationSuccess('Data Sync', 'All records synced')

      expect(mockToastComposable.success).toHaveBeenCalledWith(
        'Data Sync Successful',
        'All records synced'
      )
    })
  })

  describe('operationError', () => {
    it('should show operation error toast with default detail', () => {
      toastHelpers.operationError('Database Query')

      expect(mockToastComposable.error).toHaveBeenCalledWith(
        'Database Query Failed',
        'Failed to complete database query'
      )
    })

    it('should show operation error toast with custom error message', () => {
      toastHelpers.operationError('API Call', 'Timeout after 30 seconds')

      expect(mockToastComposable.error).toHaveBeenCalledWith(
        'API Call Failed',
        'Timeout after 30 seconds'
      )
    })
  })

  describe('validationError', () => {
    it('should show validation error toast with default message', () => {
      toastHelpers.validationError()

      expect(mockToastComposable.warn).toHaveBeenCalledWith(
        'Validation Error',
        'Please check the form for errors'
      )
    })

    it('should show validation error toast with custom message', () => {
      toastHelpers.validationError('Email format is invalid')

      expect(mockToastComposable.warn).toHaveBeenCalledWith(
        'Validation Error',
        'Email format is invalid'
      )
    })
  })

  describe('networkError', () => {
    it('should show network error toast with default detail', () => {
      toastHelpers.networkError()

      expect(mockToastComposable.error).toHaveBeenCalledWith(
        'Network Error',
        'Please check your internet connection and try again'
      )
    })

    it('should show network error toast with custom detail', () => {
      toastHelpers.networkError('API server is unreachable')

      expect(mockToastComposable.error).toHaveBeenCalledWith(
        'Network Error',
        'API server is unreachable'
      )
    })
  })
})