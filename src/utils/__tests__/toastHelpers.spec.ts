import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toastHelpers } from '../toastHelpers'
import { setToastService, getToastService } from '../toastService'

describe('toastHelpers', () => {
  let mockToastService: any

  beforeEach(() => {
    mockToastService = {
      add: vi.fn(),
      removeAllGroups: vi.fn(),
      removeGroup: vi.fn()
    }
    
    // Set up the mock toast service
    setToastService(mockToastService)
  })

  describe('success', () => {
    it('should show success toast with summary and detail', () => {
      toastHelpers.success('Operation Complete', 'Data saved successfully')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Operation Complete',
        detail: 'Data saved successfully',
        life: 3000,
        closable: true
      })
    })

    it('should show success toast with summary only', () => {
      toastHelpers.success('Success!')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success!',
        detail: undefined,
        life: 3000,
        closable: true
      })
    })
  })

  describe('info', () => {
    it('should show info toast', () => {
      toastHelpers.info('Information', 'Here is some info')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Information',
        detail: 'Here is some info',
        life: 3000,
        closable: true
      })
    })
  })

  describe('warn', () => {
    it('should show warning toast', () => {
      toastHelpers.warn('Warning', 'Be careful')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Be careful',
        life: 3000,
        closable: true
      })
    })
  })

  describe('error', () => {
    it('should show error toast', () => {
      toastHelpers.error('Error', 'Something went wrong')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong',
        life: 0,
        closable: true
      })
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

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'warn',
        summary: 'Custom Toast',
        detail: 'Custom message',
        life: 5000,
        closable: true
      })
    })
  })

  describe('clear', () => {
    it('should clear all toasts', () => {
      toastHelpers.clear()

      expect(mockToastService.removeAllGroups).toHaveBeenCalled()
    })
  })

  describe('operationSuccess', () => {
    it('should show operation success toast with default detail', () => {
      toastHelpers.operationSuccess('File Upload')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'File Upload Successful',
        detail: 'File Upload completed successfully',
        life: 3000,
        closable: true
      })
    })

    it('should show operation success toast with custom detail', () => {
      toastHelpers.operationSuccess('Data Sync', 'All records synced')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Data Sync Successful',
        detail: 'All records synced',
        life: 3000,
        closable: true
      })
    })
  })

  describe('operationError', () => {
    it('should show operation error toast with default detail', () => {
      toastHelpers.operationError('Database Query')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Database Query Failed',
        detail: 'Failed to complete database query',
        life: 0,
        closable: true
      })
    })

    it('should show operation error toast with custom error message', () => {
      toastHelpers.operationError('API Call', 'Timeout after 30 seconds')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'API Call Failed',
        detail: 'Timeout after 30 seconds',
        life: 0,
        closable: true
      })
    })
  })

  describe('validationError', () => {
    it('should show validation error toast with default message', () => {
      toastHelpers.validationError()

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please check the form for errors',
        life: 3000,
        closable: true
      })
    })

    it('should show validation error toast with custom message', () => {
      toastHelpers.validationError('Email format is invalid')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Email format is invalid',
        life: 3000,
        closable: true
      })
    })
  })

  describe('networkError', () => {
    it('should show network error toast with default detail', () => {
      toastHelpers.networkError()

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Network Error',
        detail: 'Please check your internet connection and try again',
        life: 0,
        closable: true
      })
    })

    it('should show network error toast with custom detail', () => {
      toastHelpers.networkError('API server is unreachable')

      expect(mockToastService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Network Error',
        detail: 'API server is unreachable',
        life: 0,
        closable: true
      })
    })
  })
})