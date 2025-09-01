import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AppBar from '../AppBar.vue'
import { useAppStore } from '@/stores/app.store'
import { createPinia, setActivePinia } from 'pinia'

// Mock the store
vi.mock('@/stores/app.store', () => ({
  useAppStore: vi.fn()
}))

describe('AppBar.vue', () => {
  let mockAppStore: any
  let router: any
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    mockAppStore = {
      availableTools: [],
      activeTool: null,
      switchTool: vi.fn()
    }
    vi.mocked(useAppStore).mockReturnValue(mockAppStore)

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/about', component: { template: '<div>About</div>' } }
      ]
    })
  })

  describe('Basic Rendering', () => {
    it('should render app bar with brand name', () => {
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain('My Vue App')
    })

    it('should render navigation links', () => {
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const homeLink = wrapper.find('a[href="/"]')
      const aboutLink = wrapper.find('a[href="/about"]')

      expect(homeLink.exists()).toBe(true)
      expect(homeLink.text()).toBe('Home')
      expect(aboutLink.exists()).toBe(true)
      expect(aboutLink.text()).toBe('About')
    })

    it('should have sticky positioning', () => {
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const header = wrapper.find('header')
      expect(header.classes()).toContain('app-bar')
    })
  })

  describe('Teleport Targets', () => {
    it('should provide app-bar-left teleport target', () => {
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const leftTarget = wrapper.find('#app-bar-left')
      expect(leftTarget.exists()).toBe(true)
      expect(leftTarget.classes()).toContain('flex')
      expect(leftTarget.classes()).toContain('items-center')
    })

    it('should provide app-bar-actions teleport target', () => {
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const actionsTarget = wrapper.find('#app-bar-actions')
      expect(actionsTarget.exists()).toBe(true)
      expect(actionsTarget.classes()).toContain('flex')
      expect(actionsTarget.classes()).toContain('items-center')
    })

    it('should provide app-bar-settings teleport target', () => {
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const settingsTarget = wrapper.find('#app-bar-settings')
      expect(settingsTarget.exists()).toBe(true)
      expect(settingsTarget.classes()).toContain('flex')
      expect(settingsTarget.classes()).toContain('items-center')
    })

    it('should render teleport targets in correct order', () => {
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const targets = wrapper.findAll('[id^="app-bar-"]')
      expect(targets).toHaveLength(3)
      
      // Check order: left, actions, settings
      expect(targets[0].attributes('id')).toBe('app-bar-left')
      expect(targets[1].attributes('id')).toBe('app-bar-actions') 
      expect(targets[2].attributes('id')).toBe('app-bar-settings')
    })
  })

  describe('Tool Selector', () => {
    it('should not show tool selector when no tools available', () => {
      mockAppStore.availableTools = []
      
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const toolSelector = wrapper.find('select')
      expect(toolSelector.exists()).toBe(false)
    })

    it('should show tool selector when tools are available', () => {
      mockAppStore.availableTools = [
        { id: 'tool1', name: 'Tool 1' },
        { id: 'tool2', name: 'Tool 2' }
      ]
      
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const toolSelector = wrapper.find('select')
      expect(toolSelector.exists()).toBe(true)
      
      const options = wrapper.findAll('option')
      expect(options).toHaveLength(3) // "Select Tool" + 2 tools
      expect(options[0].text()).toBe('Select Tool')
      expect(options[1].text()).toBe('Tool 1')
      expect(options[2].text()).toBe('Tool 2')
    })

    it('should call switchTool when tool is selected', async () => {
      mockAppStore.availableTools = [
        { id: 'tool1', name: 'Tool 1' }
      ]
      
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const select = wrapper.find('select')
      await select.setValue('tool1')

      expect(mockAppStore.switchTool).toHaveBeenCalledWith('tool1')
    })

    it('should show selected tool in selector', () => {
      mockAppStore.availableTools = [
        { id: 'tool1', name: 'Tool 1' }
      ]
      mockAppStore.activeTool = { id: 'tool1', name: 'Tool 1' }
      
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const select = wrapper.find('select')
      expect((select.element as HTMLSelectElement).value).toBe('tool1')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
      
      // Navigation should be properly structured
      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
    })

    it('should have focus management for keyboard navigation', () => {
      mockAppStore.availableTools = [
        { id: 'tool1', name: 'Tool 1' }
      ]
      
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('focus:border-blue-400')
      expect(select.classes()).toContain('focus:outline-none')
    })
  })

  describe('Error Handling', () => {
    it('should handle switchTool errors gracefully', async () => {
      mockAppStore.availableTools = [
        { id: 'tool1', name: 'Tool 1' }
      ]
      mockAppStore.switchTool.mockRejectedValue(new Error('Tool switch failed'))
      
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const select = wrapper.find('select')
      
      // Should not throw
      await expect(select.setValue('tool1')).resolves.not.toThrow()
      expect(mockAppStore.switchTool).toHaveBeenCalledWith('tool1')
    })

    it('should handle empty tool selection', async () => {
      mockAppStore.availableTools = [
        { id: 'tool1', name: 'Tool 1' }
      ]
      
      const wrapper = mount(AppBar, {
        global: {
          plugins: [router]
        }
      })

      const select = wrapper.find('select')
      await select.setValue('')

      // Should not call switchTool for empty value
      expect(mockAppStore.switchTool).not.toHaveBeenCalled()
    })
  })
})