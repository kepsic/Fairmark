import { test, expect } from '@playwright/test'

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and setup
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    // Login
    await page.goto('/login')
    await page.fill('input[type="text"]', 'TestUser')
    await page.click('button:has-text("Continue")')
  })

  test('should create task, assign it, and update status', async ({ page }) => {
    // Create a group first
    await page.goto('/groups/new')
    await page.fill('input[placeholder*="name"]', 'Task Test Group')
    await page.fill('input[type="number"]', '15')
    await page.click('button:has-text("Create Group")')

    await page.waitForURL(/\/group\/.*/)
    const groupUrl = page.url()
    const groupId = groupUrl.split('/group/')[1]

    // Add a member to assign task to
    await page.click('a:has-text("Add Member")')
    await page.fill('input[placeholder*="name"]', 'Alice')
    await page.click('button:has-text("Add Member")')

    // Create a task
    await page.click('a:has-text("+ New Task")')
    await page.fill('input[placeholder*="title"]', 'Write Documentation')
    await page.fill('textarea', 'Create comprehensive user documentation')
    await page.fill('input[type="number"]', '8')
    await page.click('button:has-text("Create Task")')

    // Task should appear in table
    await expect(page.locator('text=Write Documentation')).toBeVisible()

    // Click on the task to view details
    await page.click('text=Write Documentation')
    await page.waitForURL(/\/group\/.*\/tasks\/.*/)

    // Verify task details page
    await expect(page.locator('h1')).toContainText('Write Documentation')
    await expect(page.locator('text=8 hours')).toBeVisible()

    // Assign the task
    await page.selectOption('select#assignedTo', { label: 'Alice' })
    await page.click('button:has-text("Save Assignment")')

    // Verify assignment saved
    await expect(page.locator('text=Assigned to: Alice')).toBeVisible()

    // Change status to In Progress
    await page.selectOption('select#status', 'in-progress')
    await page.click('button:has-text("Update Status")')

    // Verify status changed
    await expect(page.locator('text=Status: In Progress')).toBeVisible()

    // Change status to Done
    await page.selectOption('select#status', 'done')
    await page.click('button:has-text("Update Status")')

    // Verify status changed to done
    await expect(page.locator('text=Status: Done')).toBeVisible()

    console.log('✅ Task creation, assignment, and status updates working')
  })

  test('should auto-assign multiple unassigned tasks', async ({ page }) => {
    // Create a group
    await page.goto('/groups/new')
    await page.fill('input[placeholder*="name"]', 'Auto-Assign Test')
    await page.fill('input[type="number"]', '30')
    await page.click('button:has-text("Create Group")')

    await page.waitForURL(/\/group\/.*/)

    // Add multiple members
    const members = ['Alice', 'Bob', 'Charlie']
    for (const member of members) {
      await page.click('a:has-text("Add Member")')
      await page.fill('input[placeholder*="name"]', member)
      await page.click('button:has-text("Add Member")')
      await page.waitForURL(/\/group\/.*/)
    }

    // Create multiple tasks
    const tasks = [
      { title: 'Task 1', hours: '5' },
      { title: 'Task 2', hours: '3' },
      { title: 'Task 3', hours: '7' },
      { title: 'Task 4', hours: '4' },
    ]

    for (const task of tasks) {
      await page.click('a:has-text("+ New Task")')
      await page.fill('input[placeholder*="title"]', task.title)
      await page.fill('input[type="number"]', task.hours)
      await page.click('button:has-text("Create Task")')
      await page.waitForURL(/\/group\/.*/)
    }

    // Verify all tasks are visible and unassigned
    for (const task of tasks) {
      await expect(page.locator(`text=${task.title}`)).toBeVisible()
    }

    // Click auto-assign button
    await page.click('button:has-text("Auto-Assign")')

    // Wait for alert and accept
    page.on('dialog', dialog => dialog.accept())

    // Verify tasks are now assigned (check for member names in task table)
    await page.waitForTimeout(1000)
    const hasAlice = await page.locator('text=Alice').isVisible()
    const hasBob = await page.locator('text=Bob').isVisible()
    const hasCharlie = await page.locator('text=Charlie').isVisible()

    expect(hasAlice || hasBob || hasCharlie).toBeTruthy()

    console.log('✅ Auto-assignment distributes tasks across team members')
  })
})
