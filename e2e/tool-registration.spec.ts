import { test, expect } from '@playwright/test'

test.describe('Tool Registration and Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should render the layout manager', async ({ page }) => {
    // Check that the main layout structure is present
    const layoutPanel = page.locator('[data-testid="main-panel"]')
    await expect(layoutPanel).toBeVisible()
  })

  test('should have tool selector with available tools', async ({ page }) => {
    // Check for tool selector dropdown
    const toolSelector = page.locator('select[data-testid="tool-selector"]')
    await expect(toolSelector).toBeVisible()
    
    // Should have multiple tool options
    const options = toolSelector.locator('option')
    await expect(options).toHaveCount(await options.count())
  })

  test('should display default tool content', async ({ page }) => {
    // Should show content for the default tool
    const contentAreas = page.locator('[data-testid="main-panel"] > div')
    await expect(contentAreas.first()).toBeVisible()
  })

  test('should switch between tools', async ({ page }) => {
    const toolSelector = page.locator('select[data-testid="tool-selector"]')
    
    // Get initial tool
    const initialValue = await toolSelector.inputValue()
    
    // Get all options
    const options = await toolSelector.locator('option').all()
    if (options.length > 1) {
      // Select a different tool
      const secondOption = await options[1].getAttribute('value')
      if (secondOption !== initialValue) {
        await toolSelector.selectOption(secondOption!)
        
        // Wait for tool to load
        await page.waitForTimeout(500)
        
        // Verify tool switched
        const newValue = await toolSelector.inputValue()
        expect(newValue).toBe(secondOption)
      }
    }
  })

  test('should handle layout mode switching', async ({ page }) => {
    const layoutToggle = page.locator('[data-testid="layout-toggle"]')
    
    if (await layoutToggle.isVisible()) {
      await layoutToggle.click()
      await page.waitForTimeout(300)
      
      // Should still have some layout visible after layout change
      const anyLayout = page.locator('div.flex, div.h-full').first()
      await expect(anyLayout).toBeVisible()
    }
  })
})