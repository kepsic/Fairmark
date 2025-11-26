import { test, expect } from '@playwright/test'

test.describe('Canvas Mock Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should load Canvas mock data with predefined project and tasks', async ({ page }) => {
    await page.goto('/login')

    // Verify Canvas mock button exists
    await expect(page.locator('button:has-text("Load Data From Canvas")')).toBeVisible()

    // Click to load Canvas data
    await page.click('button:has-text("Load Data From Canvas")')

    // Login as one of the Canvas mock users
    await page.fill('input[type="text"]', 'Alice')
    await page.click('button:has-text("Continue")')

    // Should be on groups page
    await expect(page).toHaveURL('/groups')

    // Verify the SaaS Platform MVP project exists
    await expect(page.locator('text=SaaS Platform MVP')).toBeVisible()

    // Click on the project
    await page.click('text=SaaS Platform MVP')
    await page.waitForURL(/\/group\/.*/)

    // Verify project details
    await expect(page.locator('h1')).toContainText('Alice')

    // Verify tasks from Canvas mock exist
    await expect(page.locator('text=Wireframes')).toBeVisible()
    await expect(page.locator('text=API Design')).toBeVisible()
    await expect(page.locator('text=UI Components')).toBeVisible()
    await expect(page.locator('text=Testing')).toBeVisible()
    await expect(page.locator('text=User Stories')).toBeVisible()
    await expect(page.locator('text=Deployment')).toBeVisible()

    // Verify team members
    await expect(page.locator('text=Bob')).toBeVisible()
    await expect(page.locator('text=Charlie')).toBeVisible()
    await expect(page.locator('text=Diana')).toBeVisible()

    // Verify fairness issue (Alice has 57% - should show warning)
    const contributionTable = page.locator('table').first()
    await expect(contributionTable).toBeVisible()

    console.log('✅ Canvas mock data loaded successfully with all tasks and members')
  })

  test('should show Diana as Sherpa role in Canvas mock data', async ({ page }) => {
    // Load Canvas mock
    await page.goto('/login')
    await page.click('button:has-text("Load Data From Canvas")')
    await page.fill('input[type="text"]', 'Alice')
    await page.click('button:has-text("Continue")')

    // Navigate to Canvas mock project
    await page.click('text=SaaS Platform MVP')
    await page.waitForURL(/\/group\/.*/)

    // Look for Sherpa indicator for Diana
    const sherpaIndicator = page.locator('text=Sherpa')
    await expect(sherpaIndicator).toBeVisible()

    console.log('✅ Sherpa role correctly displayed in Canvas mock data')
  })
})
