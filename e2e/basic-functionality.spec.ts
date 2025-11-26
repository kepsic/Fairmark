import { test, expect } from '@playwright/test'

test.describe('Basic Functionality Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Fairmark/)
  })

  test('login page loads and has correct elements', async ({ page }) => {
    await page.goto('/login')
    
    // Check for heading
    await expect(page.locator('h1')).toContainText('Welcome')
    
    // Check for input
    await expect(page.locator('input[type="text"]')).toBeVisible()
    
    // Check for buttons
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('button:has-text("Load Demo")')).toBeVisible()
    await expect(page.locator('button:has-text("Load Data From Canvas")')).toBeVisible()
    
    console.log('✅ Login page loads correctly')
  })

  test('demo data loads and displays projects', async ({ page }) => {
    await page.goto('/login')
    
    // Click load demo button
    await page.click('button:has-text("Load Demo")')
    
    // Should navigate to groups page
    await page.waitForURL('/groups', { waitUntil: 'networkidle', timeout: 20000 })
    
    // Check for demo projects
    await expect(page.locator('text=E-Commerce Platform')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Mobile Fitness App')).toBeVisible()
    await expect(page.locator('text=AI Chatbot System')).toBeVisible()
    
    console.log('✅ Demo data loads successfully')
  })

  test('Canvas mock data loads with SaaS Platform MVP', async ({ page }) => {
    await page.goto('/login')
    
    // Load Canvas mock
    await page.click('button:has-text("Load Data From Canvas")')
    
    // Navigate to groups
    await page.waitForURL('/groups', { waitUntil: 'networkidle', timeout: 20000 })
    
    // Check for Canvas project
    await expect(page.locator('text=SaaS Platform MVP')).toBeVisible({ timeout: 10000 })
    
    console.log('✅ Canvas mock data loads')
  })

  test('can navigate to group page and see tasks', async ({ page }) => {
    // Load Canvas data
    await page.goto('/login')
    await page.click('button:has-text("Load Data From Canvas")')
    await page.waitForURL('/groups', { waitUntil: 'networkidle', timeout: 20000 })
    
    // Click on project
    await page.click('text=SaaS Platform MVP')
    await page.waitForURL(/\/group\/.*/, { waitUntil: 'networkidle', timeout: 20000 })
    
    // Verify we're on the group page
    await expect(page.locator('h1')).toContainText('Hi Alice')
    
    // Check for tasks
    await expect(page.locator('text=Wireframes')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=API Design')).toBeVisible()
    
    // Check for tables (there are multiple - task table and contribution table)
    const tables = await page.locator('table').count()
    expect(tables).toBeGreaterThan(0)
    
    console.log('✅ Group page displays tasks and members')
  })

  test('teacher dashboard is accessible and displays projects', async ({ page }) => {
    // Load demo data first
    await page.goto('/login')
    await page.click('button:has-text("Load Demo")')
    await page.waitForURL('/groups', { waitUntil: 'networkidle', timeout: 20000 })
    
    // Verify we're on groups page and data loaded
    await expect(page.locator('text=E-Commerce Platform')).toBeVisible()
    
    // Now navigate to teacher dashboard
    await page.goto('/teacher/projects')
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    
    // Check for teacher dashboard content (may have different heading)
    const pageContent = await page.content()
    const hasTeacherContent = pageContent.includes('Teacher') || pageContent.includes('Projects')
    expect(hasTeacherContent).toBeTruthy()
    
    // Check for projects in the content
    await expect(page.locator('text=E-Commerce Platform')).toBeVisible({ timeout: 10000 })
    
    console.log('✅ Teacher dashboard accessible')
  })
})
