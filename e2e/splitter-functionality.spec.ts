import { test, expect } from '@playwright/test'

test.describe('Resizable Split Panels', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('load')
    await page.waitForSelector('[data-testid="main-panel"]', { timeout: 5000 })
  })

  test('should load application with split panels in 3col mode', async ({ page }) => {
    // Wait for the layout to load
    await expect(page.locator('[data-testid="main-panel"]')).toBeVisible()
    
    // Check that PrimeVue Splitter is present (only for main/middle panels)
    await expect(page.locator('.p-splitter')).toBeVisible()
    
    // Verify two resizable panels (main and middle) - right panel is fixed
    await expect(page.locator('.p-splitterpanel')).toHaveCount(2)
  })

  test('should have resizable gutters only between main and middle in 3col mode', async ({ page }) => {
    // Look for splitter gutters (only 1 between main and middle)
    await expect(page.locator('.p-splitter-gutter')).toHaveCount(1) // Only 1 gutter between main/middle
    
    // Verify gutter handle is present
    await expect(page.locator('.p-splitter-gutter-handle')).toHaveCount(1)
  })

  test('should switch to 2col mode with no splitters', async ({ page }) => {
    // Switch to 2col layout
    await page.locator('[data-testid="layout-toggle"] button:has-text("2col")').click()
    
    // Verify 2col layout has no splitters (fixed layout)
    await expect(page.locator('.p-splitterpanel')).toHaveCount(0)
    await expect(page.locator('.p-splitter-gutter')).toHaveCount(0)
  })

  test('should switch to focused mode and hide splitters', async ({ page }) => {
    // Switch to focused layout
    await page.locator('[data-testid="layout-toggle"] button:has-text("focused")').click()
    
    // Verify no splitters in focused mode
    await expect(page.locator('.p-splitter')).toHaveCount(0)
  })

  test('should keep debug controls fixed and separate from splitters', async ({ page }) => {
    // Debug controls should be in a fixed position overlay
    const debugControls = page.locator('.fixed.top-4.left-4')
    await expect(debugControls).toBeVisible()
    
    // Debug controls should not be inside the splitter
    await expect(debugControls.locator('.p-splitter')).toHaveCount(0)
    
    // Switch layouts and verify debug controls remain fixed
    await page.locator('[data-testid="layout-toggle"] button:has-text("2col")').click()
    await expect(debugControls).toBeVisible()
    
    await page.locator('[data-testid="layout-toggle"] button:has-text("focused")').click()
    await expect(debugControls).toBeVisible()
  })

  test('should have proper styling on splitter components', async ({ page }) => {
    // Check that splitter has expected CSS classes
    const splitter = page.locator('.p-splitter')
    await expect(splitter).toHaveCSS('background-color', /rgba?\(250, 250, 250|#fafafa/i)
    
    // Check gutter styling
    const gutter = page.locator('.p-splitter-gutter').first()
    await expect(gutter).toBeVisible()
  })

  test('should maintain panel content during layout switches', async ({ page }) => {
    // Verify main content is present in 3col (with splitter panels)
    await expect(page.locator('[data-testid="main-panel"]')).toBeVisible()
    await expect(page.locator('.p-splitterpanel').first()).toBeVisible()
    
    // Switch to 2col and verify content is still there (no splitter panels)
    await page.locator('[data-testid="layout-toggle"] button:has-text("2col")').click()
    await expect(page.locator('.flex-1.bg-gray-100')).toBeVisible()
    
    // Switch back to 3col and verify splitter content returns
    await page.locator('[data-testid="layout-toggle"] button:has-text("3col")').click()
    await expect(page.locator('.p-splitterpanel').first()).toBeVisible()
  })
})