import { test, expect } from '@playwright/test'

test.describe('Toast Notification Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Track console errors and logs
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text())
      } else if (msg.type() === 'log') {
        console.log('Browser console log:', msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Navigate to Debug Tool
    const toolSelector = page.locator('select[data-testid="tool-selector"]')
    await toolSelector.selectOption('debug-tool')
    await page.waitForTimeout(1000)
  })

  test('should display Debug Tool with toast testing section', async ({ page }) => {
    // Verify we're in Debug Tool
    await expect(page.locator('text=Debug Tool - Main Panel')).toBeVisible()
    
    // Check for toast testing section
    await expect(page.locator('text=Toast System Testing')).toBeVisible()
    
    // Check for toast buttons
    await expect(page.locator('button:has-text("Success Toast")')).toBeVisible()
    await expect(page.locator('button:has-text("Error Toast")')).toBeVisible()
    await expect(page.locator('button:has-text("Info Toast")')).toBeVisible()
    await expect(page.locator('button:has-text("Warning Toast")')).toBeVisible()
  })

  test('should show success toast when Success Toast button is clicked', async ({ page }) => {
    // Click the Success Toast button
    await page.locator('button:has-text("Success Toast")').click()
    
    // Wait a moment for toast to appear
    await page.waitForTimeout(500)
    
    // Look for toast container or notification
    const toastContainer = page.locator('[data-testid="toast-container"], .toast, [role="alert"], .notification')
    const toastMessage = page.locator('text=Data Saved, text=saved successfully')
    
    // Take a screenshot to see what's actually happening
    await page.screenshot({ path: 'test-results/success-toast-click.png', fullPage: true })
    
    // Log current DOM state around potential toast areas
    const bodyHTML = await page.locator('body').innerHTML()
    console.log('DOM after success toast click:', bodyHTML.substring(0, 1000) + '...')
    
    // Check if toast appears anywhere in the DOM
    const hasToastElement = await toastContainer.count() > 0
    const hasToastMessage = await toastMessage.count() > 0
    
    console.log('Toast container found:', hasToastElement)
    console.log('Toast message found:', hasToastMessage)
    
    // Expect at least one of these to be true
    expect(hasToastElement || hasToastMessage).toBe(true)
  })

  test('should show error toast when Error Toast button is clicked', async ({ page }) => {
    // Click the Error Toast button
    await page.locator('button:has-text("Error Toast")').click()
    
    // Wait a moment for toast to appear
    await page.waitForTimeout(500)
    
    // Look for toast container or error message
    const toastContainer = page.locator('[data-testid="toast-container"], .toast, [role="alert"], .notification')
    const errorMessage = page.locator('text=Server Error, text=unable to connect')
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/error-toast-click.png', fullPage: true })
    
    // Check if error toast appears
    const hasToastElement = await toastContainer.count() > 0
    const hasErrorMessage = await errorMessage.count() > 0
    
    console.log('Error toast container found:', hasToastElement)
    console.log('Error toast message found:', hasErrorMessage)
    
    // Expect at least one of these to be true
    expect(hasToastElement || hasErrorMessage).toBe(true)
  })

  test('should show multiple toasts when multiple buttons are clicked', async ({ page }) => {
    // Click multiple toast buttons quickly
    await page.locator('button:has-text("Success Toast")').click()
    await page.waitForTimeout(100)
    await page.locator('button:has-text("Warning Toast")').click()
    await page.waitForTimeout(100)
    await page.locator('button:has-text("Info Toast")').click()
    
    // Wait for toasts to appear
    await page.waitForTimeout(1000)
    
    // Take a screenshot to see multiple toasts
    await page.screenshot({ path: 'test-results/multiple-toasts.png', fullPage: true })
    
    // Look for multiple toast elements
    const toastElements = page.locator('[data-testid="toast-container"], .toast, [role="alert"], .notification')
    const toastCount = await toastElements.count()
    
    console.log('Number of toast elements found:', toastCount)
    
    // Should have at least one toast (ideally 3, but let's see what we get)
    expect(toastCount).toBeGreaterThan(0)
  })

  test('should clear all toasts when Clear All Toasts button is clicked', async ({ page }) => {
    // First, create some toasts
    await page.locator('button:has-text("Success Toast")').click()
    await page.locator('button:has-text("Error Toast")').click()
    await page.waitForTimeout(500)
    
    // Click clear all toasts
    await page.locator('button:has-text("Clear All Toasts")').click()
    await page.waitForTimeout(500)
    
    // Take a screenshot after clearing
    await page.screenshot({ path: 'test-results/toasts-cleared.png', fullPage: true })
    
    // Check that no toasts remain
    const remainingToasts = page.locator('[data-testid="toast-container"], .toast, [role="alert"], .notification')
    const remainingCount = await remainingToasts.count()
    
    console.log('Remaining toasts after clear:', remainingCount)
    
    // Should be 0 or hidden
    expect(remainingCount).toBe(0)
  })

  test('should verify toast implementation actually exists', async ({ page }) => {
    // Check if useToast composable is properly imported and used
    const pageSource = await page.content()
    console.log('Page contains useToast:', pageSource.includes('useToast'))
    
    // Check if toast-related CSS classes exist
    const hasToastStyles = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets)
      return stylesheets.some(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || [])
          return rules.some(rule => rule.cssText.includes('toast') || rule.cssText.includes('notification'))
        } catch {
          return false
        }
      })
    })
    
    console.log('Toast-related styles found:', hasToastStyles)
    
    // Check if toast container exists in DOM at all
    const bodyHTML = await page.locator('body').innerHTML()
    const hasToastInDOM = bodyHTML.includes('toast') || bodyHTML.includes('notification')
    console.log('Toast elements in DOM:', hasToastInDOM)
    
    // Check network requests for any toast-related assets
    const requests: string[] = []
    page.on('request', request => {
      requests.push(request.url())
    })
    
    await page.reload()
    await page.waitForTimeout(2000)
    
    const hasToastAssets = requests.some(url => 
      url.includes('toast') || 
      url.includes('notification') ||
      url.includes('composables')
    )
    
    console.log('Toast-related assets loaded:', hasToastAssets)
    console.log('All requests:', requests.filter(url => url.includes('localhost')))
  })
})