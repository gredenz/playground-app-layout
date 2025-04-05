import { test, expect } from '@playwright/test'

test.describe('Counter Application', () => {
  let getElement

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    getElement = async () => page.locator('#counter-text').innerText()
  })

  test('should display initial count of 0', async ({ page }) => {
    expect(await getElement()).toEqual('10')
  })

  test('should increment counter', async ({ page }) => {
    await page.getByText('Increment').click()
    const countText = await getCountText()
    expect(countText).toContain('1')
  })

  test('should decrement counter', async ({ page }) => {
    await page.getByText('Decrement').click()
    const countText = await getCountText()
    expect(countText).toContain('-1')
  })

  test('should handle multiple operations', async ({ page }) => {
    // Increment twice
    await page.getByText('Increment').click()
    await page.getByText('Increment').click()
    let countText = await getCountText()
    expect(countText).toContain('2')

    // Decrement once
    await page.getByText('Decrement').click()
    countText = await getCountText()
    expect(countText).toContain('1')
  })
})
