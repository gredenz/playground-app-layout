import { test, expect } from '@playwright/test'

test.describe('Toast Debug Investigation', () => {
  test.beforeEach(async ({ page }) => {
    // Track all console messages
    page.on('console', msg => {
      console.log(`[${msg.type().toUpperCase()}]`, msg.text())
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Navigate to Debug Tool
    const toolSelector = page.locator('select[data-testid="tool-selector"]')
    await toolSelector.selectOption('debug-tool')
    await page.waitForTimeout(1000)
  })

  test('should investigate toast service injection and DOM state', async ({ page }) => {
    // Check if toast service is available in Vue app
    const hasToastService = await page.evaluate(() => {
      // Access Vue app instance from window
      const app = window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.apps?.[0]
      if (!app) return 'No Vue app found'
      
      // Check if toast service is available
      try {
        const toast = app.config.globalProperties.$toast
        return {
          hasToastService: !!toast,
          toastMethods: toast ? Object.keys(toast) : [],
          appMounted: !!app._instance?.isMounted
        }
      } catch (e) {
        return `Error accessing toast: ${e.message}`
      }
    })
    
    console.log('Toast service investigation:', hasToastService)
    
    // Check DOM for toast container before clicking
    const initialToastContainer = await page.locator('div[data-pc-name="toast"], .p-toast, [data-testid="toast-container"]').count()
    console.log('Initial toast containers:', initialToastContainer)
    
    // Check if Toast component is in DOM
    const toastElementInDOM = await page.evaluate(() => {
      return document.querySelector('div[data-pc-name="toast"]') !== null ||
             document.querySelector('.p-toast') !== null ||
             document.querySelector('toast') !== null
    })
    console.log('Toast element in DOM:', toastElementInDOM)
    
    // Click success toast button and capture console output
    console.log('--- CLICKING SUCCESS TOAST BUTTON ---')
    await page.locator('button:has-text("Success Toast")').click()
    
    // Wait and check again
    await page.waitForTimeout(1000)
    
    const afterClickToastContainer = await page.locator('div[data-pc-name="toast"], .p-toast, [data-testid="toast-container"]').count()
    console.log('Toast containers after click:', afterClickToastContainer)
    
    // Check if any new elements appeared
    const allToastLikeElements = await page.evaluate(() => {
      const selectors = [
        'div[data-pc-name="toast"]',
        '.p-toast',
        '.toast',
        '[role="alert"]',
        '[data-testid="toast-container"]',
        'div[class*="toast"]',
        'div[class*="notification"]'
      ]
      
      const results = {}
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        results[selector] = elements.length
      })
      
      return results
    })
    
    console.log('All toast-like elements after click:', allToastLikeElements)
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'test-results/toast-debug-investigation.png', fullPage: true })
    
    // Log the entire document body to see what's actually there
    const bodyInnerHTML = await page.evaluate(() => document.body.innerHTML)
    console.log('Body innerHTML (first 2000 chars):', bodyInnerHTML.substring(0, 2000))
  })

  test('should test toast service directly via browser console', async ({ page }) => {
    // Try to call toast service directly from browser
    const directToastResult = await page.evaluate(() => {
      // Access Vue app
      const app = window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.apps?.[0]
      if (!app) return 'No app found'
      
      try {
        const toast = app.config.globalProperties.$toast
        if (!toast) return 'No toast service found'
        
        // Try to call toast.add directly
        toast.add({
          severity: 'success',
          summary: 'Direct Test',
          detail: 'Called directly from browser',
          life: 3000
        })
        
        return 'Toast.add called successfully'
      } catch (e) {
        return `Error calling toast: ${e.message}`
      }
    })
    
    console.log('Direct toast call result:', directToastResult)
    
    // Wait and check for toast
    await page.waitForTimeout(1000)
    
    // Take screenshot after direct call
    await page.screenshot({ path: 'test-results/toast-direct-call.png', fullPage: true })
    
    // Check if toast appeared
    const toastAfterDirect = await page.locator('div[data-pc-name="toast"], .p-toast').count()
    console.log('Toasts after direct call:', toastAfterDirect)
  })
})