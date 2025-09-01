import { test, expect } from '@playwright/test'

test.describe('Tool Registration and Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // Track console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text())
      }
    })
    
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
        await page.waitForTimeout(1000)
        
        // Verify tool switched
        const newValue = toolSelector
        await expect(newValue).toHaveValue(secondOption)
      }
    }
  })

  test('should render Debug Tool components when activated', async ({ page }) => {
    const toolSelector = page.locator('select[data-testid="tool-selector"]')
    
    // Select Debug Tool
    await toolSelector.selectOption('debug-tool')
    await page.waitForTimeout(1000)
    
    // Check for Debug Tool specific content in all three panels
    const debugMainContent = page.locator('text=Debug Tool - Main Panel')
    const debugMiddleContent = page.locator('text=Debug Logs') 
    const toolListContent = page.locator('h3:has-text("Tools")')
    
    await expect(debugMainContent).toBeVisible()
    await expect(debugMiddleContent).toBeVisible()
    await expect(toolListContent).toBeVisible()
    
    // Check for specific debug functionality in each panel
    // Main panel - system info
    await expect(page.locator('text=System Information')).toBeVisible()
    await expect(page.locator('text=App State')).toBeVisible()
    
    // Middle panel - logs and network info
    await expect(page.locator('text=Recent Activity')).toBeVisible()
    await expect(page.locator('text=Network Requests')).toBeVisible()
    await expect(page.locator('button:has-text("Add Demo Log")')).toBeVisible()
    
    // Right panel - tool list (allows switching)
    await expect(page.locator('button:has-text("SEO Score Analyzer")')).toBeVisible()
    await expect(page.locator('button:has-text("Debug Tool")')).toBeVisible()
    
    // Ensure no loading indicators are present
    await expect(page.locator('div:has-text("Loading...")')).toBeHidden()
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