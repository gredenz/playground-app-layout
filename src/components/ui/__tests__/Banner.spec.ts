import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Banner from '../Banner.vue'
import Message from 'primevue/message'
import PrimeVue from 'primevue/config'

// Mock timers for testing auto-hide functionality
vi.useFakeTimers()

// Helper to create wrapper with PrimeVue setup
const createWrapper = (props: Record<string, unknown>, options: Record<string, unknown> = {}) => {
  return mount(Banner, {
    props,
    global: {
      plugins: [[PrimeVue, { theme: 'none' }]],
      components: { Message },
      ...options.global
    },
    ...options
  })
}

describe('Banner.vue', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('PrimeVue Message Integration', () => {
    it('should render PrimeVue Message component', () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test Banner'
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.exists()).toBe(true)
    })

    it('should pass severity prop to Message', () => {
      const wrapper = createWrapper({
        severity: 'error',
        title: 'Error Banner'
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.props('severity')).toBe('error')
    })

    it('should pass closable prop to Message', () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test',
        closable: false
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.props('closable')).toBe(false)
    })

    it('should pass life prop to Message', () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test',
        life: 5000
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.props('life')).toBe(5000)
    })

    it('should pass icon prop to Message', () => {
      const wrapper = createWrapper({
        severity: 'warn',
        title: 'Warning',
        icon: 'pi pi-exclamation-triangle'
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.props('icon')).toBe('pi pi-exclamation-triangle')
    })
  })

  describe('Content Rendering', () => {
    it('should render title and message in structured layout', () => {
      const wrapper = createWrapper({
        severity: 'success',
        title: 'Success!',
        message: 'Operation completed successfully'
      })

      expect(wrapper.text()).toContain('Success!')
      expect(wrapper.text()).toContain('Operation completed successfully')
      
      // Should render in structured div
      const contentDiv = wrapper.find('.flex.flex-col.space-y-1')
      expect(contentDiv.exists()).toBe(true)
    })

    it('should render only title when no message provided', () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Info Title'
      })

      expect(wrapper.text()).toContain('Info Title')
      
      // Should still render content structure
      const titleP = wrapper.find('p.font-medium')
      expect(titleP.exists()).toBe(true)
      expect(titleP.text()).toBe('Info Title')
    })

    it('should render slot content when no title or message provided', () => {
      const wrapper = createWrapper({
        severity: 'info'
      }, {
        slots: {
          default: '<span data-testid="custom-content">Custom Banner Content</span>'
        }
      })

      const customContent = wrapper.find('[data-testid="custom-content"]')
      expect(customContent.exists()).toBe(true)
      expect(customContent.text()).toBe('Custom Banner Content')
    })

    it('should not render content div when using slot', () => {
      const wrapper = createWrapper({
        severity: 'info'
      }, {
        slots: {
          default: 'Slot content'
        }
      })

      const contentDiv = wrapper.find('.flex.flex-col.space-y-1')
      expect(contentDiv.exists()).toBe(false)
    })
  })

  describe('Event Handling', () => {
    it('should emit dismiss when Message emits close', async () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test',
        closable: true
      })

      const messageComponent = wrapper.findComponent(Message)
      await messageComponent.vm.$emit('close')

      expect(wrapper.emitted('dismiss')).toBeTruthy()
      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })

    it('should emit dismiss when Message emits life-end', async () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test',
        life: 1000
      })

      const messageComponent = wrapper.findComponent(Message)
      await messageComponent.vm.$emit('life-end')

      expect(wrapper.emitted('dismiss')).toBeTruthy()
      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })

    it('should hide banner when dismissed', async () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test'
      })

      expect(wrapper.findComponent(Message).exists()).toBe(true)

      // Trigger dismiss
      const messageComponent = wrapper.findComponent(Message)
      await messageComponent.vm.$emit('close')
      await nextTick()

      // Banner should be hidden
      expect(wrapper.findComponent(Message).exists()).toBe(false)
    })
  })

  describe('Auto-hide Functionality', () => {
    it('should set up auto-hide timeout when life is provided', () => {
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      createWrapper({
        severity: 'info',
        title: 'Test',
        life: 3000
      })

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000)
    })

    it('should not set timeout when life is 0', () => {
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      createWrapper({
        severity: 'info',
        title: 'Test',
        life: 0
      })

      expect(setTimeoutSpy).not.toHaveBeenCalled()
    })

    it('should not set timeout when life is not provided', () => {
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      createWrapper({
        severity: 'info',
        title: 'Test'
      })

      expect(setTimeoutSpy).not.toHaveBeenCalled()
    })

    it('should auto-dismiss after timeout', async () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Auto-hide test',
        life: 1000
      })

      expect(wrapper.findComponent(Message).exists()).toBe(true)

      // Fast-forward time
      vi.advanceTimersByTime(1000)
      await nextTick()

      expect(wrapper.emitted('dismiss')).toBeTruthy()
    })

    it('should clear timeout when manually dismissed', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test',
        life: 5000
      })

      // Manually dismiss before timeout
      const messageComponent = wrapper.findComponent(Message)
      await messageComponent.vm.$emit('close')

      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('Default Props', () => {
    it('should have correct default values', () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test'
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.props('closable')).toBe(true)
      expect(messageComponent.props('life')).toBe(0)
    })
  })

  describe('Component Lifecycle', () => {
    it('should clear timeout on component unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test',
        life: 5000
      })

      wrapper.unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
    })

    it('should handle multiple dismiss calls gracefully', async () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test',
        life: 1000
      })

      const messageComponent = wrapper.findComponent(Message)
      
      // Emit dismiss multiple times
      await messageComponent.vm.$emit('close')
      await messageComponent.vm.$emit('life-end')
      
      // Should only emit once due to isVisible check
      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should apply w-full class to Message', () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test'
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.classes()).toContain('w-full')
    })

    it('should apply correct styling to content structure', () => {
      const wrapper = createWrapper({
        severity: 'success',
        title: 'Success',
        message: 'Details'
      })

      const contentDiv = wrapper.find('.flex.flex-col.space-y-1')
      expect(contentDiv.exists()).toBe(true)

      const title = wrapper.find('p.font-medium')
      expect(title.exists()).toBe(true)

      const message = wrapper.find('p.text-sm.opacity-90')
      expect(message.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should maintain Message component accessibility features', () => {
      const wrapper = createWrapper({
        severity: 'error',
        title: 'Error Message',
        closable: true
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.exists()).toBe(true)
      
      // PrimeVue Message handles ARIA attributes internally
      expect(messageComponent.props('severity')).toBe('error')
      expect(messageComponent.props('closable')).toBe(true)
    })
  })
})