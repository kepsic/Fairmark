import { test, expect } from '@playwright/test'

test.describe('Teacher Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    
    // Load demo data which includes multiple projects
    await page.goto('/login')
    await page.click('button:has-text("Load Demo")')
    await page.fill('input[type="text"]', 'Alice Johnson')
    await page.click('button:has-text("Continue")')
  })

  test('should display all projects in teacher dashboard', async ({ page }) => {
    // Navigate to teacher dashboard
    await page.goto('/teacher/projects')
    
    // Verify page loaded
    await expect(page.locator('h1')).toContainText('Teacher Dashboard')
    
    // Verify summary statistics are displayed
    await expect(page.locator('text=/Total Projects/i')).toBeVisible()
    await expect(page.locator('text=/Total Students/i')).toBeVisible()
    
    // Verify project cards/list items are visible
    await expect(page.locator('text=E-Commerce Platform')).toBeVisible()
    await expect(page.locator('text=Mobile Fitness App')).toBeVisible()
    await expect(page.locator('text=AI Chatbot System')).toBeVisible()
    
    console.log('✅ Teacher dashboard displays all projects')
  })

  test('should navigate to individual project detail and show fairness analysis', async ({ page }) => {
    // Go to teacher dashboard
    await page.goto('/teacher/projects')
    
    // Click on a project (E-Commerce Platform has unbalanced contributions)
    await page.click('text=E-Commerce Platform')
    
    // Should be on project detail page
    await page.waitForURL(/\/teacher\/project\/.*/)
    await expect(page.locator('h1')).toContainText('E-Commerce Platform')
    
    // Verify project details are shown
    await expect(page.locator('text=/Team Members/i')).toBeVisible()
    await expect(page.locator('text=/Total Tasks/i')).toBeVisible()
    
    // Verify contribution table exists
    await expect(page.locator('table')).toBeVisible()
    
    // Verify fairness badge/indicator
    const fairnessBadge = page.locator('text=/fairness/i').first()
    await expect(fairnessBadge).toBeVisible()
    
    // Check for contribution graph
    const graphSection = page.locator('text=/Contribution Distribution/i')
    await expect(graphSection).toBeVisible()
    
    console.log('✅ Teacher project detail shows comprehensive analysis')
  })

  test('should show grading recommendations on project detail page', async ({ page }) => {
    await page.goto('/teacher/projects')
    
    // Click on unbalanced project
    await page.click('text=E-Commerce Platform')
    await page.waitForURL(/\/teacher\/project\/.*/)
    
    // Look for grading recommendations section
    const gradingSection = page.locator('text=/Grading Recommendations/i')
    await expect(gradingSection).toBeVisible()
    
    // Verify recommendations text is present
    const recommendations = page.locator('text=/grade/i')
    const count = await recommendations.count()
    expect(count).toBeGreaterThan(0)
    
    console.log('✅ Grading recommendations displayed')
  })
})
