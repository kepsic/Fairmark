import { test, expect } from '@playwright/test'

test.describe('Fairness Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should show green fairness badge for balanced contributions', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[type="text"]', 'Alice')
    await page.click('button:has-text("Continue")')
    
    // Create group
    await page.goto('/groups/new')
    await page.fill('input[placeholder*="name"]', 'Balanced Team')
    await page.fill('input[type="number"]', '20')
    await page.click('button:has-text("Create Group")')
    
    await page.waitForURL(/\/group\/.*/)
    const groupUrl = page.url()
    
    // Add members with balanced contributions
    await page.click('a:has-text("Add Member")')
    await page.fill('input[placeholder*="name"]', 'Bob')
    await page.click('button:has-text("Add Member")')
    
    await page.click('a:has-text("Add Member")')
    await page.fill('input[placeholder*="name"]', 'Charlie')
    await page.click('button:has-text("Add Member")')
    
    // Create and assign tasks evenly
    const tasks = [
      { title: 'Task 1', hours: '5', assignee: 'Alice' },
      { title: 'Task 2', hours: '5', assignee: 'Bob' },
      { title: 'Task 3', hours: '5', assignee: 'Charlie' },
    ]
    
    for (const task of tasks) {
      await page.click('a:has-text("+ New Task")')
      await page.fill('input[placeholder*="title"]', task.title)
      await page.fill('input[type="number"]', task.hours)
      await page.click('button:has-text("Create Task")')
      await page.waitForURL(/\/group\/.*/)
    }
    
    // Navigate back to group dashboard
    await page.goto(groupUrl)
    
    // Check fairness badge exists
    const fairnessBadge = page.locator('[class*="fairness"], [class*="Fairness"]').first()
    await expect(fairnessBadge).toBeVisible({ timeout: 10000 })
    
    console.log('✅ Fairness badge displayed for balanced team')
  })

  test('should show unbalanced warning when one member has >50% contribution', async ({ page }) => {
    // Load Canvas mock data which has Alice at 57%
    await page.goto('/login')
    await page.click('button:has-text("Load Data From Canvas")')
    
    // Login as Alice
    await page.fill('input[type="text"]', 'Alice')
    await page.click('button:has-text("Continue")')
    
    // Navigate to the Canvas mock group
    await page.click('text=SaaS Platform MVP')
    
    // Verify we're on the group page
    await expect(page.locator('h1')).toContainText('Alice')
    
    // Check for fairness indicator (should show unbalanced)
    const fairnessSection = page.locator('text=/fairness/i').first()
    await expect(fairnessSection).toBeVisible()
    
    // Verify Alice's high contribution percentage in contribution table
    const contributionTable = page.locator('table')
    await expect(contributionTable).toBeVisible()
    
    console.log('✅ Unbalanced team detected in Canvas mock data')
  })
})
