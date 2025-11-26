import { test, expect } from '@playwright/test'

test.describe('Core User Flow - Student Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should complete full student workflow: login, create group, add tasks, track fairness', async ({ page }) => {
    // Step 1: Login
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText('Welcome')
    
    await page.fill('input[type="text"]', 'Alice')
    await page.waitForTimeout(500)
    await page.click('button[type="submit"]')
    
    await page.waitForURL('/groups', { timeout: 10000 })
    await expect(page).toHaveURL('/groups')
    
    // Step 2: Create a new group
    await page.click('a:has-text("Create New Group")')
    await page.waitForURL('/groups/new')
    await expect(page).toHaveURL('/groups/new')
    
    await page.locator('input').first().fill('E2E Test Project')
    await page.locator('textarea').fill('End-to-end testing project for Fairmark')
    await page.locator('input[type="number"]').fill('20')
    await page.waitForTimeout(500)
    await page.click('button[type="submit"]')
    
    // Should redirect to group page
    await page.waitForURL(/\/group\/.*/)
    await expect(page.locator('h1')).toContainText('Hi Alice')
    
    // Step 3: Add a team member
    await page.click('a:has-text("Add Member")')
    await page.waitForURL(/\/group\/.*\/add-member/)
    await page.locator('input[type="text"]').fill('Bob')
    await page.waitForTimeout(500)
    await page.click('button[type="submit"]')
    
    // Should be back on group page
    await page.waitForURL(/\/group\/[^\/]+$/)
    
    // Step 4: Create a task
    await page.click('a:has-text("+ New Task")')
    await page.waitForURL(/\/group\/.*\/tasks\/new/)
    await page.locator('input').first().fill('Setup Development Environment')
    await page.locator('textarea').fill('Install Node.js, npm, and clone repository')
    await page.locator('input[type="number"]').fill('5')
    await page.waitForTimeout(500)
    await page.click('button[type="submit"]')
    
    // Verify task appears in task table
    await expect(page.locator('text=Setup Development Environment')).toBeVisible()
    await expect(page.locator('text=5h')).toBeVisible()
    
    // Step 5: Check fairness badge (should be green initially with no contributions)
    const fairnessBadge = page.locator('text=/Fairness/i').first()
    await expect(fairnessBadge).toBeVisible()
    
    // Step 6: Add manual contribution
    await page.click('a:has-text("Add Work")')
    await page.waitForURL(/\/group\/.*\/contribute/)
    await page.locator('input[type="number"]').first().fill('8')
    await page.locator('input[type="number"]').nth(1).fill('3')
    await page.waitForTimeout(500)
    await page.click('button[type="submit"]')
    
    // Verify contribution is recorded
    await expect(page.locator('text=8h')).toBeVisible()
    
    console.log('✅ Full student workflow completed successfully')
  })
})
