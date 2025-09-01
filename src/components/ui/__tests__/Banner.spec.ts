import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, createApp } from 'vue'
import Banner from '../Banner.vue'
import Message from 'primevue/message'
import PrimeVue from 'primevue/config'

// Mock timers for testing auto-hide functionality
vi.useFakeTimers()

// Create test helper to mount components with PrimeVue
const createWrapper = (props: any, options: any = {}) => {
  return mount(Banner, {
    props,
    global: {
      plugins: [
        [PrimeVue, { theme: 'none' }]
      ],
      components: {
        Message
      },
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

  describe('Rendering', () => {
    it('should render with basic props', () => {
      const wrapper = createWrapper({
        severity: 'info',
        title: 'Test Banner'
      })

      expect(wrapper.findComponent(Message).exists()).toBe(true)
      expect(wrapper.text()).toContain('Test Banner')
    })

    it('should render with title and message', () => {
      const wrapper = createWrapper({
        severity: 'success',
        title: 'Success!',
        message: 'Operation completed successfully'
      })

      expect(wrapper.text()).toContain('Success!')
      expect(wrapper.text()).toContain('Operation completed successfully')
    })

    it('should pass correct props to PrimeVue Message', () => {
      const wrapper = mount(Banner, {
        props: {
          severity: 'error',
          title: 'Error',
          closable: true,
          life: 3000
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.props('severity')).toBe('error')
      expect(messageComponent.props('closable')).toBe(true)
      expect(messageComponent.props('life')).toBe(3000)
    })

    it('should render with custom icon', () => {
      const wrapper = mount(Banner, {
        props: {
          severity: 'warn',
          title: 'Warning',
          icon: 'pi pi-exclamation-triangle'
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.props('icon')).toBe('pi pi-exclamation-triangle')
    })

    it('should render slot content when no title or message provided', () => {
      const wrapper = mount(Banner, {
        props: {
          severity: 'info'
        },
        slots: {
          default: '<span>Custom slot content</span>'
      })

      expect(wrapper.text()).toContain('Custom slot content')
    })
  })

  describe('Dismissal', () => {
    it('should emit dismiss event when Message emits close', async () => {
      const wrapper = mount(Banner, {
        props: {
          severity: 'info',
          title: 'Test',
          closable: true
      })

      const messageComponent = wrapper.findComponent(Message)
      await messageComponent.vm.$emit('close')

      expect(wrapper.emitted('dismiss')).toBeTruthy()
    })

    it('should emit dismiss event when Message emits life-end', async () => {
      const wrapper = mount(Banner, {
        props: {
          severity: 'info',
          title: 'Test',
          life: 1000
      })

      const messageComponent = wrapper.findComponent(Message)
      await messageComponent.vm.$emit('life-end')

      expect(wrapper.emitted('dismiss')).toBeTruthy()
    })

    it('should hide banner when dismissed', async () => {
      const wrapper = mount(Banner, {
        props: {
          severity: 'info',
          title: 'Test'
      })

      expect(wrapper.findComponent(Message).exists()).toBe(true)

      // Trigger dismiss
      const messageComponent = wrapper.findComponent(Message)
      await messageComponent.vm.$emit('close')
      await nextTick()

      // Banner should be hidden (isVisible = false)
      expect(wrapper.findComponent(Message).exists()).toBe(false)
    })
  })

  describe('Auto-hide functionality', () => {
    it('should auto-hide after specified life duration', async () => {
      const wrapper = mount(Banner, {
        props: {
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

    it('should clear timeout on manual dismiss', async () => {
      const wrapper = mount(Banner, {
        props: {
          severity: 'info',
          title: 'Test',
          life: 5000
      })

      // Manually dismiss before timeout
      const messageComponent = wrapper.findComponent(Message)
      await messageComponent.vm.$emit('close')

      // Fast-forward time beyond original timeout
      vi.advanceTimersByTime(6000)
      await nextTick()

      // Should only emit dismiss once (for manual dismiss, not timeout)
      expect(wrapper.emitted('dismiss')).toHaveLength(1)
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
  })

  describe('Cleanup', () => {
    it('should clear timeout on component unmount', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const wrapper = mount(Banner, {
        props: {
          severity: 'info',
          title: 'Test',
          life: 5000
      })

      wrapper.unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('Default props', () => {
    it('should have correct default values', () => {
      const wrapper = mount(Banner, {
        props: {
          severity: 'info',
          title: 'Test'
      })

      const messageComponent = wrapper.findComponent(Message)
      expect(messageComponent.props('closable')).toBe(true)
      expect(messageComponent.props('life')).toBe(0)
    })
  })
})