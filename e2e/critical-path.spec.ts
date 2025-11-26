import { test, expect } from '@playwright/test'

test.describe('Critical Path Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should load Canvas mock data and display project', async ({ page }) => {
    // Go to login page
    await page.goto('/login')
    
    // Load Canvas mock data (automatically navigates to /groups)
    const loadButton = page.locator('button', { hasText: 'Load Data From Canvas' })
    await loadButton.click()
    
    // Wait for automatic navigation
    await page.waitForURL('/groups', { timeout: 15000 })
    
    // Verify Canvas mock project exists
    await expect(page.locator('text=SaaS Platform MVP')).toBeVisible({ timeout: 10000 })
    
    // Click on the Canvas project to verify its details
    await page.click('text=SaaS Platform MVP')
    await page.waitForURL(/\/group\/.*/, { timeout: 15000 })
    
    // Verify project tasks exist
    await expect(page.locator('text=Wireframes')).toBeVisible()
    await expect(page.locator('text=API Design')).toBeVisible()
    
    console.log('✅ Canvas mock data loaded successfully')
  })

  test('should create new group and navigate to it', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.locator('input[type="text"]').fill('TestUser')
    await page.waitForTimeout(500)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/groups', { timeout: 15000 })
    
    // Go to create new group
    await page.click('text=Create New Group')
    await page.waitForURL('/groups/new')
    
    // Fill form
    const inputs = await page.locator('input').all()
    await inputs[0].fill('Simple Test Group')
    await page.locator('input[type="number"]').fill('10')
    await page.waitForTimeout(500)
    
    // Submit
    await page.locator('button[type="submit"]').click()
    
    // Verify redirect to group page
    await page.waitForURL(/\/group\/.*/, { timeout: 15000 })
    await expect(page.locator('text=Simple Test Group')).toBeVisible()
    
    console.log('✅ Group created successfully')
  })

  test('should load demo data and access teacher dashboard', async ({ page }) => {
    // Login and load demo (loads demo AND navigates automatically)
    await page.goto('/login')
    await page.click('button:has-text("Load Demo")')
    
    // Wait for automatic navigation to /groups
    await page.waitForURL('/groups', { timeout: 15000 })
    
    // Verify demo data loaded
    await expect(page.locator('text=E-Commerce Platform')).toBeVisible()
    
    // Navigate to teacher dashboard
    await page.goto('/teacher/projects')
    
    // Verify teacher dashboard loaded
    await expect(page.locator('h1')).toContainText('Teacher', { timeout: 10000 })
    await expect(page.locator('text=E-Commerce Platform')).toBeVisible()
    
    console.log('✅ Teacher dashboard accessible')
  })

  test('should display fairness badge on group page', async ({ page }) => {
    // Load demo data (automatically navigates to /groups)
    await page.goto('/login')
    await page.click('button:has-text("Load Demo")')
    await page.waitForURL('/groups', { timeout: 15000 })
    
    // Click on first project
    await page.click('text=E-Commerce Platform')
    await page.waitForURL(/\/group\/.*/, { timeout: 15000 })
    
    // Check for fairness content (badge or status)
    const hasFairnessText = await page.locator('text=/fairness/i').count() > 0
    const hasBalancedText = await page.locator('text=/balanced/i').count() > 0
    const hasUnbalancedText = await page.locator('text=/unbalanced/i').count() > 0
    
    expect(hasFairnessText || hasBalancedText || hasUnbalancedText).toBeTruthy()
    
    console.log('✅ Fairness indicator displayed')
  })

  test('should display contribution table with member data', async ({ page }) => {
    // Load demo data (automatically navigates to /groups)
    await page.goto('/login')
    await page.click('button:has-text("Load Demo")')
    await page.waitForURL('/groups', { timeout: 15000 })
    
    // Navigate to project
    await page.click('text=E-Commerce Platform')
    await page.waitForURL(/\/group\/.*/, { timeout: 15000 })
    
    // Verify contribution table exists
    const table = page.locator('table').first()
    await expect(table).toBeVisible({ timeout: 10000 })
    
    // Verify member names are in table
    await expect(page.locator('text=Alice Johnson')).toBeVisible()
    await expect(page.locator('text=Bob Smith')).toBeVisible()
    
    console.log('✅ Contribution table displayed with members')
  })
})
