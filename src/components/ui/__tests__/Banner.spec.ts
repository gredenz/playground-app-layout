import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Banner from '../Banner.vue'

// Mock timers for testing auto-hide functionality
vi.useFakeTimers()

describe('Banner.vue', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Rendering', () => {
    it('should render with basic props', () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner'
        }
      })

      expect(wrapper.find('.banner').exists()).toBe(true)
      expect(wrapper.text()).toContain('Test Banner')
    })

    it('should render message when provided', () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner',
          message: 'This is a test message'
        }
      })

      expect(wrapper.text()).toContain('Test Banner')
      expect(wrapper.text()).toContain('This is a test message')
    })

    it('should apply correct CSS classes for each banner type', () => {
      const types = ['info', 'warning', 'error', 'success', 'maintenance'] as const
      const expectedClasses = {
        info: 'bg-blue-50 border-blue-400 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
        error: 'bg-red-50 border-red-400 text-red-800',
        success: 'bg-green-50 border-green-400 text-green-800',
        maintenance: 'bg-purple-50 border-purple-400 text-purple-800'
      }

      types.forEach(type => {
        const wrapper = mount(Banner, {
          props: {
            type,
            title: `${type} banner`
          }
        })

        const banner = wrapper.find('.banner')
        expect(banner.classes()).toContain(expectedClasses[type].split(' ')[0]) // Check first class
      })
    })

    it('should have correct ARIA role', () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner'
        }
      })

      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    })
  })

  describe('Dismissible functionality', () => {
    it('should show dismiss button when dismissible is true (default)', () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner'
        }
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should hide dismiss button when dismissible is false', () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner',
          dismissible: false
        }
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('should emit dismiss event when dismiss button is clicked', async () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner'
        }
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('dismiss')
      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })

    it('should become invisible when dismissed', async () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner'
        }
      })

      expect(wrapper.find('.banner').exists()).toBe(true)

      await wrapper.find('button').trigger('click')
      await nextTick()

      expect(wrapper.find('.banner').exists()).toBe(false)
    })

    it('should have correct aria-label on dismiss button', () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'warning',
          title: 'Test Banner'
        }
      })

      const dismissButton = wrapper.find('button')
      expect(dismissButton.attributes('aria-label')).toBe('Dismiss warning notification')
    })
  })

  describe('Auto-hide functionality', () => {
    it('should not auto-hide when autoHide is false (default)', async () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner'
        }
      })

      // Fast-forward time
      vi.advanceTimersByTime(10000)
      await nextTick()

      expect(wrapper.find('.banner').exists()).toBe(true)
      expect(wrapper.emitted('dismiss')).toBeUndefined()
    })

    it('should auto-hide after specified delay when autoHide is true', async () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner',
          autoHide: true,
          autoHideDelay: 3000
        }
      })

      expect(wrapper.find('.banner').exists()).toBe(true)

      // Fast-forward time to just before auto-hide
      vi.advanceTimersByTime(2999)
      await nextTick()
      expect(wrapper.find('.banner').exists()).toBe(true)

      // Fast-forward to trigger auto-hide
      vi.advanceTimersByTime(1)
      await nextTick()

      expect(wrapper.find('.banner').exists()).toBe(false)
      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })

    it('should use default autoHideDelay when not specified', async () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner',
          autoHide: true
        }
      })

      // Fast-forward to default delay (5000ms)
      vi.advanceTimersByTime(5000)
      await nextTick()

      expect(wrapper.find('.banner').exists()).toBe(false)
      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })

    it('should clear timeout when manually dismissed before auto-hide', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
      
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner',
          autoHide: true,
          autoHideDelay: 5000
        }
      })

      // Manually dismiss before auto-hide
      await wrapper.find('button').trigger('click')

      expect(clearTimeoutSpy).toHaveBeenCalled()
      expect(wrapper.find('.banner').exists()).toBe(false)

      clearTimeoutSpy.mockRestore()
    })

    it('should clear timeout on unmount to prevent memory leaks', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
      
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner',
          autoHide: true,
          autoHideDelay: 5000
        }
      })

      wrapper.unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      clearTimeoutSpy.mockRestore()
    })
  })

  describe('Icon rendering', () => {
    it('should render correct icon for each banner type', () => {
      const types = ['info', 'warning', 'error', 'success', 'maintenance'] as const

      types.forEach(type => {
        const wrapper = mount(Banner, {
          props: {
            type,
            title: `${type} banner`
          }
        })

        // Should have an SVG icon
        expect(wrapper.find('svg').exists()).toBe(true)
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle empty title gracefully', () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: ''
        }
      })

      expect(wrapper.find('.banner').exists()).toBe(true)
    })

    it('should handle very long titles and messages', () => {
      const longTitle = 'A'.repeat(200)
      const longMessage = 'B'.repeat(500)
      
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: longTitle,
          message: longMessage
        }
      })

      expect(wrapper.text()).toContain(longTitle)
      expect(wrapper.text()).toContain(longMessage)
    })

    it('should handle zero autoHideDelay', async () => {
      const wrapper = mount(Banner, {
        props: {
          type: 'info',
          title: 'Test Banner',
          autoHide: true,
          autoHideDelay: 0
        }
      })

      // Should auto-dismiss immediately
      vi.advanceTimersByTime(0)
      await nextTick()

      expect(wrapper.find('.banner').exists()).toBe(false)
    })
  })
})