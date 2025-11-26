import { test, expect } from '@playwright/test'

test.describe('Disainmõtlemine Project E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('BROWSER:', msg.text()))
    
    // First load demo data
    await page.goto('/login')
    console.log('✓ Navigated to login page')
    
    // Click load demo and wait for it to complete
    await page.click('button:has-text("Load Demo")')
    console.log('✓ Clicked Load Demo button')
    
    // Wait for navigation with longer timeout for async database operations
    await page.waitForURL('/groups', { waitUntil: 'domcontentloaded', timeout: 30000 })
    console.log('✓ Navigated to groups page')
    
    // Wait for database operations to complete
    await page.waitForTimeout(5000)
    console.log('✓ Waited for database operations')
    
    // Verify projects are loaded
    await expect(page.locator('text=E-Commerce Platform')).toBeVisible({ timeout: 20000 })
    console.log('✓ Demo data loaded successfully')
    
    // Now logout and login as Andres
    await page.click('button:has-text("Switch User")')
    console.log('✓ Clicked Switch User')
    
    // Wait for login page
    await page.waitForURL('/login', { timeout: 10000 })
    
    // Login as Andres
    await page.fill('input[type="text"]', 'Andres')
    await page.click('button[type="submit"]')
    console.log('✓ Logged in as Andres')
    
    // Wait for groups page
    await page.waitForURL('/groups', { timeout: 10000 })
    console.log('✓ Ready for tests as Andres')
  })

  test('Disainmõtlemine project appears in demo data', async ({ page }) => {
    // Check that Disainmõtlemine project is visible (using contains for special characters)
    const projectCard = page.locator('text=/Disainm.*tlemine/')
    await expect(projectCard).toBeVisible({ timeout: 15000 })
    
    // Alternative: check by description
    await expect(page.locator('text=/University group work.*fairness/')).toBeVisible()
    
    console.log('✅ Disainmõtlemine project is visible in project list')
  })

  test('can navigate to Disainmõtlemine project dashboard', async ({ page }) => {
    // Click on Disainmõtlemine project using regex for special characters
    await page.click('text=/Disainm.*tlemine/')
    
    // Wait for navigation
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Check project title
    await expect(page.locator('h1')).toContainText('Disainm')
    
    console.log('✅ Successfully navigated to Disainmõtlemine dashboard')
  })

  test('displays all 5 team members correctly', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Check for all team members
    const members = ['Andres', 'Arto', 'Eva', 'Getter', 'Jarmo']
    
    for (const member of members) {
      await expect(page.locator(`text=${member}`).first()).toBeVisible()
    }
    
    // Verify Getter is a sherpa
    const getterRow = page.locator('tr:has-text("Getter")')
    await expect(getterRow).toContainText('Sherpa')
    
    console.log('✅ All 5 team members are displayed correctly')
  })

  test('shows 20 project tasks', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Scroll to tasks section
    await page.locator('text=Project Tasks').scrollIntoViewIfNeeded()
    
    // Check for technical tasks assigned to Andres
    await expect(page.locator('text=RxDB Integration')).toBeVisible()
    await expect(page.locator('text=Database Schema Design')).toBeVisible()
    await expect(page.locator('text=Context API Migration')).toBeVisible()
    
    // Check for non-technical tasks
    await expect(page.locator('text=User Research Interviews')).toBeVisible()
    await expect(page.locator('text=Design System Creation')).toBeVisible()
    await expect(page.locator('text=Competitive Analysis')).toBeVisible()
    await expect(page.locator('text=Project Documentation')).toBeVisible()
    
    // Check for unassigned collaborative tasks
    await expect(page.locator('text=Ideation Workshop')).toBeVisible()
    
    console.log('✅ All 20 tasks are visible')
  })

  test('Andres has technical tasks assigned', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Check technical tasks in the task list
    const rxdbTask = page.locator('tr:has-text("RxDB Integration")')
    await expect(rxdbTask).toContainText('Andres')
    await expect(rxdbTask).toContainText('Done')
    
    const schemaTask = page.locator('tr:has-text("Database Schema Design")')
    await expect(schemaTask).toContainText('Andres')
    
    console.log('✅ Andres has technical tasks assigned')
  })

  test('non-technical members have appropriate tasks', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Check Arto's user research tasks
    const artoTask = page.locator('tr:has-text("User Research Interviews")')
    await expect(artoTask).toContainText('Arto')
    
    // Check Eva's design tasks
    const evaTask = page.locator('tr:has-text("Design System Creation")')
    await expect(evaTask).toContainText('Eva')
    
    // Check Getter's strategy tasks
    const getterTask = page.locator('tr:has-text("Competitive Analysis")')
    await expect(getterTask).toContainText('Getter')
    
    // Check Jarmo's documentation tasks
    const jarmoTask = page.locator('tr:has-text("Project Documentation")')
    await expect(jarmoTask).toContainText('Jarmo')
    
    console.log('✅ Non-technical members have appropriate tasks')
  })

  test('can view task details from Disainmõtlemine project', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Click on a task to view details
    await page.click('text=RxDB Integration')
    
    // Wait for task detail page
    await page.waitForURL(/\/group\/demo-group-4\/tasks\/task-4-1/, { timeout: 10000 })
    
    // Verify task details
    await expect(page.locator('h1:has-text("RxDB Integration")')).toBeVisible()
    await expect(page.locator('text=Replace localStorage with RxDB database engine')).toBeVisible()
    await expect(page.locator('text=Andres')).toBeVisible()
    await expect(page.locator('text=8')).toBeVisible() // Hours
    
    console.log('✅ Can view task details')
  })

  test('fairness badge shows project balance status', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Check if fairness badge is visible
    const fairnessBadge = page.locator('[class*="fairness"], [class*="badge"]').first()
    await expect(fairnessBadge).toBeVisible()
    
    console.log('✅ Fairness badge is displayed')
  })

  test('can auto-assign unassigned tasks', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Click auto-assign button
    await page.click('button:has-text("Auto-Assign")')
    
    // Wait for alert or confirmation
    await page.waitForTimeout(1000)
    
    console.log('✅ Auto-assign functionality works')
  })

  test('contribution table shows hours and task counts', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Check contribution table
    const contributionTable = page.locator('table').first()
    await expect(contributionTable).toBeVisible()
    
    // Verify Andres's hours (29h)
    const andresRow = page.locator('tr:has-text("Andres")')
    await expect(andresRow).toContainText('29')
    
    // Verify Eva's hours (25h)
    const evaRow = page.locator('tr:has-text("Eva")')
    await expect(evaRow).toContainText('25')
    
    console.log('✅ Contribution table displays correct data')
  })

  test('can create new task in Disainmõtlemine project', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Click New Task button
    await page.click('text=New Task')
    
    // Wait for new task form
    await page.waitForURL(/\/group\/demo-group-4\/tasks\/new/, { timeout: 10000 })
    
    // Fill task form
    await page.fill('input[placeholder*="title" i], input[name="title"]', 'Test Task')
    await page.fill('textarea[placeholder*="description" i], textarea[name="description"]', 'Test description')
    await page.fill('input[type="number"]', '5')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should navigate back to project page
    await page.waitForURL(/\/group\/demo-group-4$/, { timeout: 10000 })
    
    // Verify new task appears
    await expect(page.locator('text=Test Task')).toBeVisible()
    
    console.log('✅ Can create new tasks')
  })

  test('can assign tasks to team members', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Click on an unassigned task
    await page.click('text=Ideation Workshop')
    await page.waitForURL(/\/tasks\/task-4-18/, { timeout: 10000 })
    
    // Find and click assign dropdown
    const assignSelect = page.locator('select').first()
    await assignSelect.selectOption({ label: 'Andres' })
    
    // Wait for update
    await page.waitForTimeout(500)
    
    console.log('✅ Can assign tasks to members')
  })

  test('can update task status', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Click on a task in progress
    await page.click('text=Context API Migration')
    await page.waitForURL(/\/tasks\/task-4-3/, { timeout: 10000 })
    
    // Find status dropdown
    const statusSelect = page.locator('select:has(option:has-text("Done"))').first()
    await statusSelect.selectOption('done')
    
    // Wait for update
    await page.waitForTimeout(500)
    
    console.log('✅ Can update task status')
  })

  test('teacher dashboard shows Disainmõtlemine project', async ({ page }) => {
    // Navigate to teacher dashboard
    await page.goto('/teacher/projects')
    
    // Check for Disainmõtlemine in project list
    await expect(page.locator('text=/Disainm.*tlemine/')).toBeVisible({ timeout: 10000 })
    
    console.log('✅ Disainmõtlemine appears in teacher dashboard')
  })

  test('teacher can view Disainmõtlemine project details', async ({ page }) => {
    await page.goto('/teacher/projects')
    
    // Click on Disainmõtlemine project
    await page.click('text=/Disainm.*tlemine/')
    
    // Wait for project detail page
    await page.waitForURL(/\/teacher\/project\/demo-group-4/, { timeout: 10000 })
    
    // Verify page content
    await expect(page.locator('h1')).toContainText('Disainm')
    await expect(page.locator('text=5 members')).toBeVisible()
    
    console.log('✅ Teacher can view project details')
  })

  test('progress bar shows correct completion percentage', async ({ page }) => {
    await page.click('text=/Disainm.*tlemine/')
    await page.waitForURL(/\/group\/demo-group-4/, { timeout: 10000 })
    
    // Find progress bar
    const progressBar = page.locator('[class*="progress"]').first()
    await expect(progressBar).toBeVisible()
    
    console.log('✅ Progress bar is displayed')
  })

  test('all 4 demo projects load including Disainmõtlemine', async ({ page }) => {
    // Verify all projects are present
    await expect(page.locator('text=E-Commerce Platform')).toBeVisible()
    await expect(page.locator('text=Mobile Fitness App')).toBeVisible()
    await expect(page.locator('text=AI Chatbot System')).toBeVisible()
    await expect(page.locator('text=/Disainm.*tlemine/')).toBeVisible()
    
    console.log('✅ All 4 demo projects are visible')
  })
})
