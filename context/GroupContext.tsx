'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { initializeFirebase } from '@/lib/firebase/config'
import {
  getAllGroups,
  createGroup as dbCreateGroup,
  updateGroup as dbUpdateGroup,
  addMember as dbAddMember,
  updateMember as dbUpdateMember,
  removeMember as dbRemoveMember,
  addTask as dbAddTask,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
  bulkInsertGroups,
} from '@/lib/firebase/operations'
import type { GroupWithData as DBGroup, MemberDoc as DBMember, TaskDoc as DBTask } from '@/lib/firebase/types'

export type Role = 'member' | 'sherpa'

export type TaskStatus = 'todo' | 'in-progress' | 'done'

// Application-level types that match the UI expectations
export type Member = {
  id: string
  name: string
  hours: number
  tasks: number
  role?: Role
}

export type Task = {
  id: string
  title: string
  description: string
  assignedTo: string | null
  hours: number
  status: TaskStatus
}

export type Group = {
  id: string
  name: string
  description?: string
  members: Member[]
  tasks: Task[]
  totalTasksNeeded: number
  projectLead?: string
}

// Helper to convert DB types to app types
function convertFromDB(dbGroup: DBGroup): Group {
  const members: Member[] = dbGroup.members.map(m => ({
    id: m.id,
    name: m.name,
    hours: 0, // Will be calculated from tasks
    tasks: 0, // Will be calculated from tasks
    role: m.role,
  }))

  const tasks: Task[] = dbGroup.tasks.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    assignedTo: t.assignedTo,
    hours: t.estimatedHours,
    status: t.status,
  }))

  // Calculate hours and task counts for each member
  members.forEach(member => {
    const memberTasks = tasks.filter(t => t.assignedTo === member.id)
    member.tasks = memberTasks.length
    member.hours = memberTasks.reduce((sum, t) => sum + t.hours, 0)
  })

  // Try to extract additional metadata from description or use defaults
  const totalTasksNeeded = 50 // Default
  const projectLead = members[0]?.name // First member as default

  return {
    id: dbGroup.id,
    name: dbGroup.name,
    description: dbGroup.description,
    members,
    tasks,
    totalTasksNeeded,
    projectLead,
  }
}

// Helper to convert app Group to DB Group
function convertToDB(group: Group): DBGroup {
  const now = new Date().toISOString()

  return {
    id: group.id,
    name: group.name,
    description: group.description || '',
    createdAt: now,
    members: group.members.map(m => ({
      id: m.id,
      groupId: group.id,
      name: m.name,
      email: `${m.name.toLowerCase().replace(' ', '.')}@example.com`,
      role: m.role || 'member',
      joinedAt: now,
    })),
    tasks: group.tasks.map(t => ({
      id: t.id,
      groupId: group.id,
      title: t.title,
      description: t.description,
      assignedTo: t.assignedTo,
      status: t.status,
      estimatedHours: t.hours,
      actualHours: t.status === 'done' ? t.hours : 0,
      createdAt: now,
      updatedAt: now,
    })),
  }
}

type GroupContextType = {
  groups: Group[]
  currentUserName: string | null
  setCurrentUserName: (name: string | null) => void
  createGroup: (name: string, description?: string) => Promise<string>
  getGroup: (id: string) => Group | undefined
  joinGroup: (groupId: string, userName: string) => Promise<boolean>
  addMember: (groupId: string, memberName: string, role?: Role) => Promise<void>
  updateMemberContribution: (groupId: string, memberId: string, hours: number, tasks: number) => Promise<void>
  updateGroupSettings: (groupId: string, name: string, description: string, totalTasksNeeded: number) => Promise<void>
  loadDemoData: () => Promise<void>
  // Task management
  createTask: (groupId: string, title: string, description: string, hours: number) => Promise<string>
  assignTask: (groupId: string, taskId: string, memberId: string | null) => Promise<void>
  updateTaskStatus: (groupId: string, taskId: string, status: TaskStatus) => Promise<void>
  getTask: (groupId: string, taskId: string) => Task | undefined
  deleteTask: (groupId: string, taskId: string) => Promise<void>
  autoAssignTasks: (groupId: string) => Promise<number>
  loadCanvasMockData: () => Promise<void>
}

const GroupContext = createContext<GroupContextType | undefined>(undefined)

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([])
  const [currentUserName, setCurrentUserNameState] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from RxDB on mount
  useEffect(() => {
    setIsClient(true)

    async function loadData() {
      try {
        // Initialize Firebase
        initializeFirebase()

        // Load user name from localStorage (lightweight data)
        const storedUserName = localStorage.getItem('currentUserName')
        if (storedUserName) {
          setCurrentUserNameState(storedUserName)
        }

        // Load groups from Firebase
        const dbGroups = await getAllGroups()
        const convertedGroups = dbGroups.map(convertFromDB)
        setGroups(convertedGroups)
        console.log(`Loaded ${convertedGroups.length} groups from Firebase`)
      } catch (e) {
        console.error('Error loading data from Firebase', e)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Helper to refresh groups from database
  const refreshGroups = async () => {
    try {
      const dbGroups = await getAllGroups()
      setGroups(dbGroups.map(convertFromDB))
    } catch (e) {
      console.error('Error refreshing groups', e)
    }
  }

  const setCurrentUserName = (name: string | null) => {
    setCurrentUserNameState(name)
    if (name) {
      localStorage.setItem('currentUserName', name)
    } else {
      localStorage.removeItem('currentUserName')
    }
  }

  const createGroup = async (name: string, description?: string): Promise<string> => {
    const groupId = crypto.randomUUID()
    const memberId = crypto.randomUUID()

    try {
      // Create group in database
      await dbCreateGroup({
        id: groupId,
        name,
        description: description || '',
        createdAt: new Date().toISOString(),
      })

      // Add creator as first member
      await dbAddMember({
        id: memberId,
        groupId,
        name: currentUserName || 'Unknown',
        email: `${currentUserName?.toLowerCase().replace(' ', '.')}@example.com` || 'unknown@example.com',
        role: 'member',
        joinedAt: new Date().toISOString(),
      })

      // Refresh groups from database
      const dbGroups = await getAllGroups()
      setGroups(dbGroups.map(convertFromDB))

      return groupId
    } catch (e) {
      console.error('Error creating group', e)
      throw e
    }
  }

  const getGroup = (id: string): Group | undefined => {
    return groups.find(g => g.id === id)
  }

  const joinGroup = async (groupId: string, userName: string): Promise<boolean> => {
    try {
      const group = groups.find(g => g.id === groupId)
      if (!group) return false

      // Check if user already in group
      const alreadyMember = group.members.some(m => m.name === userName)
      if (alreadyMember) return true

      const memberId = crypto.randomUUID()

      await dbAddMember({
        id: memberId,
        groupId,
        name: userName,
        email: `${userName.toLowerCase().replace(' ', '.')}@example.com`,
        role: 'member',
        joinedAt: new Date().toISOString(),
      })

      await refreshGroups()
      return true
    } catch (e) {
      console.error('Error joining group', e)
      return false
    }
  }

  const addMember = async (groupId: string, memberName: string, role: Role = 'member'): Promise<void> => {
    try {
      const group = groups.find(g => g.id === groupId)
      if (!group) return

      // Check if member with same name already exists
      const existingMember = group.members.find(m => m.name === memberName)
      if (existingMember) {
        console.warn(`Member "${memberName}" already exists in group`)
        return
      }

      const memberId = crypto.randomUUID()
      await dbAddMember({
        id: memberId,
        groupId,
        name: memberName,
        email: `${memberName.toLowerCase().replace(' ', '.')}@example.com`,
        role,
        joinedAt: new Date().toISOString(),
      })

      await refreshGroups()
    } catch (e) {
      console.error('Error adding member', e)
    }
  }

  const updateMemberContribution = async (
    groupId: string,
    memberId: string,
    hours: number,
    tasks: number
  ): Promise<void> => {
    // Contributions are now calculated automatically from tasks
    // This function is kept for backward compatibility but does nothing
    console.log('updateMemberContribution called but contributions are calculated from tasks')
  }

  const updateGroupSettings = async (
    groupId: string,
    name: string,
    description: string,
    totalTasksNeeded: number
  ): Promise<void> => {
    try {
      await dbUpdateGroup(groupId, { name, description })
      // Note: totalTasksNeeded is stored in memory only for now
      await refreshGroups()
    } catch (e) {
      console.error('Error updating group settings', e)
    }
  }

  // Task management methods
  const createTask = async (groupId: string, title: string, description: string, hours: number): Promise<string> => {
    try {
      const taskId = crypto.randomUUID()
      await dbAddTask({
        id: taskId,
        groupId,
        title,
        description,
        assignedTo: null,
        status: 'todo',
        estimatedHours: hours,
        actualHours: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      await refreshGroups()
      return taskId
    } catch (e) {
      console.error('Error creating task', e)
      throw e
    }
  }

  const assignTask = async (groupId: string, taskId: string, memberId: string | null): Promise<void> => {
    try {
      await dbUpdateTask(taskId, { assignedTo: memberId })
      await refreshGroups()
    } catch (e) {
      console.error('Error assigning task', e)
    }
  }

  const updateTaskStatus = async (groupId: string, taskId: string, status: TaskStatus): Promise<void> => {
    try {
      await dbUpdateTask(taskId, { status })
      await refreshGroups()
    } catch (e) {
      console.error('Error updating task status', e)
    }
  }

  const getTask = (groupId: string, taskId: string): Task | undefined => {
    const group = getGroup(groupId)
    return group?.tasks.find(t => t.id === taskId)
  }

  const deleteTask = async (groupId: string, taskId: string): Promise<void> => {
    try {
      await dbDeleteTask(taskId)
      await refreshGroups()
    } catch (e) {
      console.error('Error deleting task', e)
    }
  }

  const autoAssignTasks = async (groupId: string): Promise<number> => {
    try {
      const group = getGroup(groupId)
      if (!group) return 0

      const unassignedTasks = group.tasks.filter(t => t.assignedTo === null)
      if (unassignedTasks.length === 0) return 0

      // Get members who are not sherpas (sherpas handle coordination, not tasks)
      const eligibleMembers = group.members.filter(m => m.role !== 'sherpa')
      if (eligibleMembers.length === 0) return 0

      // Calculate current workload for each member (sum of assigned task hours)
      const memberWorkload = eligibleMembers.map(member => {
        const assignedHours = group.tasks
          .filter(t => t.assignedTo === member.id)
          .reduce((sum, t) => sum + t.hours, 0)
        return {
          memberId: member.id,
          currentHours: assignedHours
        }
      })

      // Sort by current workload ascending (assign to least busy first)
      memberWorkload.sort((a, b) => a.currentHours - b.currentHours)

      // Assign tasks round-robin to balance workload
      for (const task of unassignedTasks) {
        // Assign to member with least current workload
        const assignTo = memberWorkload[0]
        await dbUpdateTask(task.id, { assignedTo: assignTo.memberId })

        // Update workload tracker
        assignTo.currentHours += task.hours
        memberWorkload.sort((a, b) => a.currentHours - b.currentHours)
      }

      await refreshGroups()
      return unassignedTasks.length
    } catch (e) {
      console.error('Error auto-assigning tasks', e)
      return 0
    }
  }

  const loadCanvasMockData = async (): Promise<void> => {
    try {
      console.log('Loading Canvas mock data...')

      const canvasGroup: DBGroup = {
        id: 'canvas-mock-1',
        name: 'SaaS Platform MVP',
        description: 'Mock project loaded from Canvas LMS demonstrating fairness issues',
        createdAt: new Date().toISOString(),
        members: [
          { id: 'member-alice', groupId: 'canvas-mock-1', name: 'Alice', email: 'alice@example.com', role: 'member', joinedAt: new Date().toISOString() },
          { id: 'member-bob', groupId: 'canvas-mock-1', name: 'Bob', email: 'bob@example.com', role: 'member', joinedAt: new Date().toISOString() },
          { id: 'member-charlie', groupId: 'canvas-mock-1', name: 'Charlie', email: 'charlie@example.com', role: 'member', joinedAt: new Date().toISOString() },
          { id: 'member-diana', groupId: 'canvas-mock-1', name: 'Diana', email: 'diana@example.com', role: 'sherpa', joinedAt: new Date().toISOString() },
        ],
        tasks: [
          { id: 'task-1', groupId: 'canvas-mock-1', title: 'Wireframes', description: 'Design UI wireframes for all pages', assignedTo: 'member-alice', estimatedHours: 8, actualHours: 8, status: 'done', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'task-2', groupId: 'canvas-mock-1', title: 'API Design', description: 'REST API design and documentation', assignedTo: 'member-bob', estimatedHours: 4, actualHours: 4, status: 'done', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'task-3', groupId: 'canvas-mock-1', title: 'UI Components', description: 'Build reusable React components', assignedTo: 'member-alice', estimatedHours: 6, actualHours: 3, status: 'in-progress', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'task-4', groupId: 'canvas-mock-1', title: 'Testing', description: 'Unit and integration tests', assignedTo: 'member-charlie', estimatedHours: 3, actualHours: 0, status: 'todo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'task-5', groupId: 'canvas-mock-1', title: 'User Stories', description: 'Write user stories and acceptance criteria', assignedTo: 'member-diana', estimatedHours: 5, actualHours: 5, status: 'done', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'task-6', groupId: 'canvas-mock-1', title: 'Deployment', description: 'Set up CI/CD and deploy to production', assignedTo: 'member-alice', estimatedHours: 7, actualHours: 0, status: 'todo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ],
      }

      await bulkInsertGroups([canvasGroup])
      await refreshGroups()
      setCurrentUserName('Alice')
      console.log('Canvas mock data loaded')
    } catch (e) {
      console.error('Error loading Canvas mock data', e)
    }
  }

  const loadDemoData = async (): Promise<void> => {
    console.log('Loading demo data...')

    // Initialize Firebase
    try {
      initializeFirebase()
    } catch (e) {
      console.error('Failed to initialize Firebase:', e)
      alert('Failed to initialize Firebase. Please check console for details.')
      return
    }

    const demoGroups: Group[] = [
      {
        id: 'demo-group-1',
        name: 'E-Commerce Platform',
        description: 'Building a full-stack online shopping platform with React and Node.js',
        totalTasksNeeded: 50,
        projectLead: 'Alice Johnson',
        tasks: [
          { id: 'task-1-1', title: 'Database Schema Design', description: 'Design and implement PostgreSQL schema', assignedTo: 'demo-member-1-1', hours: 8, status: 'done' },
          { id: 'task-1-2', title: 'Product Catalog API', description: 'REST API for product CRUD operations', assignedTo: 'demo-member-1-1', hours: 12, status: 'done' },
          { id: 'task-1-3', title: 'Shopping Cart Frontend', description: 'Build cart UI with React', assignedTo: 'demo-member-1-1', hours: 10, status: 'in-progress' },
          { id: 'task-1-4', title: 'Payment Integration', description: 'Integrate Stripe payment gateway', assignedTo: 'demo-member-1-1', hours: 8, status: 'in-progress' },
          { id: 'task-1-5', title: 'User Authentication', description: 'Implement JWT-based auth', assignedTo: 'demo-member-1-1', hours: 6, status: 'done' },
          { id: 'task-1-6', title: 'Product Search', description: 'Elasticsearch integration for product search', assignedTo: 'demo-member-1-2', hours: 5, status: 'done' },
          { id: 'task-1-7', title: 'Order History Page', description: 'Display user order history', assignedTo: 'demo-member-1-2', hours: 4, status: 'todo' },
          { id: 'task-1-8', title: 'Admin Dashboard', description: 'Build admin panel for product management', assignedTo: 'demo-member-1-3', hours: 6, status: 'todo' },
          { id: 'task-1-9', title: 'Email Notifications', description: 'Order confirmation emails', assignedTo: null, hours: 3, status: 'todo' },
          { id: 'task-1-10', title: 'Testing Suite', description: 'Unit and integration tests', assignedTo: null, hours: 8, status: 'todo' },
        ],
        members: [
          { id: 'demo-member-1-1', name: 'Alice Johnson', hours: 42, tasks: 28, role: 'member' },
          { id: 'demo-member-1-2', name: 'Bob Smith', hours: 8, tasks: 5, role: 'member' },
          { id: 'demo-member-1-3', name: 'Charlie Davis', hours: 6, tasks: 3, role: 'member' },
        ]
      },
      {
        id: 'demo-group-2',
        name: 'Mobile Fitness App',
        description: 'Cross-platform fitness tracking application with workout plans and nutrition',
        totalTasksNeeded: 40,
        projectLead: 'Alice Johnson',
        tasks: [
          { id: 'task-2-1', title: 'Workout Library UI', description: 'Design and build exercise catalog', assignedTo: 'demo-member-2-1', hours: 10, status: 'done' },
          { id: 'task-2-2', title: 'Progress Tracking', description: 'Charts and graphs for user progress', assignedTo: 'demo-member-2-1', hours: 8, status: 'done' },
          { id: 'task-2-3', title: 'Nutrition Calculator', description: 'Calorie and macro tracking', assignedTo: 'demo-member-2-1', hours: 7, status: 'in-progress' },
          { id: 'task-2-4', title: 'User Profile System', description: 'Profile management and settings', assignedTo: 'demo-member-2-2', hours: 6, status: 'done' },
          { id: 'task-2-5', title: 'Workout Plans API', description: 'Backend for custom workout plans', assignedTo: 'demo-member-2-2', hours: 9, status: 'done' },
          { id: 'task-2-6', title: 'Social Features', description: 'Friend system and activity feed', assignedTo: 'demo-member-2-2', hours: 8, status: 'in-progress' },
          { id: 'task-2-7', title: 'Push Notifications', description: 'Workout reminders and notifications', assignedTo: 'demo-member-2-3', hours: 5, status: 'done' },
          { id: 'task-2-8', title: 'Video Tutorial Integration', description: 'Embed exercise video guides', assignedTo: 'demo-member-2-3', hours: 4, status: 'todo' },
          { id: 'task-2-9', title: 'Offline Mode', description: 'Local data sync for offline use', assignedTo: 'demo-member-2-4', hours: 6, status: 'todo' },
          { id: 'task-2-10', title: 'Performance Testing', description: 'Load testing and optimization', assignedTo: null, hours: 4, status: 'todo' },
        ],
        members: [
          { id: 'demo-member-2-1', name: 'Alice Johnson', hours: 25, tasks: 18, role: 'member' },
          { id: 'demo-member-2-2', name: 'Diana Martinez', hours: 24, tasks: 16, role: 'sherpa' },
          { id: 'demo-member-2-3', name: 'Bob Smith', hours: 7, tasks: 4, role: 'member' },
          { id: 'demo-member-2-4', name: 'Charlie Davis', hours: 5, tasks: 2, role: 'member' },
        ]
      },
      {
        id: 'demo-group-3',
        name: 'AI Chatbot System',
        description: 'Intelligent customer service chatbot using machine learning and NLP',
        totalTasksNeeded: 35,
        projectLead: 'Diana Martinez',
        tasks: [
          { id: 'task-3-1', title: 'NLP Model Training', description: 'Train intent classification model', assignedTo: 'demo-member-3-1', hours: 12, status: 'done' },
          { id: 'task-3-2', title: 'Conversation Flow Design', description: 'Design dialogue trees and responses', assignedTo: 'demo-member-3-1', hours: 8, status: 'done' },
          { id: 'task-3-3', title: 'Chat Interface', description: 'Build web chat widget', assignedTo: 'demo-member-3-2', hours: 9, status: 'done' },
          { id: 'task-3-4', title: 'Backend API', description: 'REST API for chat processing', assignedTo: 'demo-member-3-2', hours: 10, status: 'in-progress' },
          { id: 'task-3-5', title: 'Knowledge Base Integration', description: 'Connect to FAQ database', assignedTo: 'demo-member-3-3', hours: 7, status: 'done' },
          { id: 'task-3-6', title: 'Analytics Dashboard', description: 'Track conversation metrics', assignedTo: 'demo-member-3-3', hours: 8, status: 'done' },
          { id: 'task-3-7', title: 'Multi-language Support', description: 'Implement language detection', assignedTo: 'demo-member-3-1', hours: 6, status: 'todo' },
          { id: 'task-3-8', title: 'Sentiment Analysis', description: 'Detect user emotion in messages', assignedTo: 'demo-member-3-3', hours: 5, status: 'in-progress' },
          { id: 'task-3-9', title: 'Admin Panel', description: 'Manage bot responses and settings', assignedTo: null, hours: 6, status: 'todo' },
          { id: 'task-3-10', title: 'Load Testing', description: 'Test concurrent conversation handling', assignedTo: null, hours: 4, status: 'todo' },
        ],
        members: [
          { id: 'demo-member-3-1', name: 'Diana Martinez', hours: 22, tasks: 14, role: 'member' },
          { id: 'demo-member-3-2', name: 'Charlie Davis', hours: 19, tasks: 11, role: 'member' },
          { id: 'demo-member-3-3', name: 'Bob Smith', hours: 18, tasks: 10, role: 'member' },
        ]
      },
      {
        id: 'demo-group-4',
        name: 'Disainmõtlemine',
        description: 'University group work fairness tracking system using design thinking methodology',
        totalTasksNeeded: 45,
        projectLead: 'Andres',
        tasks: [
          // Technical tasks for Andres
          { id: 'task-4-1', title: 'RxDB Integration', description: 'Replace localStorage with RxDB database engine', assignedTo: 'demo-member-4-1', hours: 8, status: 'done' },
          { id: 'task-4-2', title: 'Database Schema Design', description: 'Design schema for groups, members, and tasks', assignedTo: 'demo-member-4-1', hours: 6, status: 'done' },
          { id: 'task-4-3', title: 'Context API Migration', description: 'Update GroupContext to use async database operations', assignedTo: 'demo-member-4-1', hours: 10, status: 'in-progress' },
          { id: 'task-4-4', title: 'Performance Optimization', description: 'Optimize database queries and add indexes', assignedTo: 'demo-member-4-1', hours: 5, status: 'todo' },
          { id: 'task-4-5', title: 'Testing Infrastructure', description: 'Set up unit and E2E tests', assignedTo: 'demo-member-4-1', hours: 7, status: 'todo' },

          // Non-technical tasks for team members
          { id: 'task-4-6', title: 'User Research Interviews', description: 'Conduct interviews with 5 students about group work challenges', assignedTo: 'demo-member-4-2', hours: 8, status: 'done' },
          { id: 'task-4-7', title: 'Persona Development', description: 'Create user personas based on research findings', assignedTo: 'demo-member-4-2', hours: 5, status: 'done' },
          { id: 'task-4-8', title: 'Journey Mapping', description: 'Map student journey through group project lifecycle', assignedTo: 'demo-member-4-2', hours: 6, status: 'in-progress' },

          { id: 'task-4-9', title: 'Design System Creation', description: 'Develop color palette and typography guidelines', assignedTo: 'demo-member-4-3', hours: 7, status: 'done' },
          { id: 'task-4-10', title: 'UI Wireframes', description: 'Create low-fidelity wireframes for key screens', assignedTo: 'demo-member-4-3', hours: 8, status: 'done' },
          { id: 'task-4-11', title: 'High-Fidelity Mockups', description: 'Design final UI mockups in Figma', assignedTo: 'demo-member-4-3', hours: 10, status: 'in-progress' },

          { id: 'task-4-12', title: 'Competitive Analysis', description: 'Research existing group work management tools', assignedTo: 'demo-member-4-4', hours: 6, status: 'done' },
          { id: 'task-4-13', title: 'Feature Prioritization', description: 'Create feature priority matrix with stakeholders', assignedTo: 'demo-member-4-4', hours: 4, status: 'done' },
          { id: 'task-4-14', title: 'Usability Testing Plan', description: 'Design usability test protocol and scenarios', assignedTo: 'demo-member-4-4', hours: 5, status: 'in-progress' },

          { id: 'task-4-15', title: 'Project Documentation', description: 'Document design decisions and methodology', assignedTo: 'demo-member-4-5', hours: 7, status: 'done' },
          { id: 'task-4-16', title: 'Stakeholder Presentations', description: 'Prepare and deliver progress presentations', assignedTo: 'demo-member-4-5', hours: 6, status: 'done' },
          { id: 'task-4-17', title: 'Final Report Writing', description: 'Write comprehensive project report', assignedTo: 'demo-member-4-5', hours: 8, status: 'in-progress' },

          // Collaborative tasks
          { id: 'task-4-18', title: 'Ideation Workshop', description: 'Facilitate brainstorming session for features', assignedTo: null, hours: 4, status: 'todo' },
          { id: 'task-4-19', title: 'Usability Testing', description: 'Conduct usability tests with real users', assignedTo: null, hours: 6, status: 'todo' },
          { id: 'task-4-20', title: 'Design Critique Session', description: 'Review designs and provide feedback', assignedTo: null, hours: 3, status: 'todo' },
        ],
        members: [
          { id: 'demo-member-4-1', name: 'Andres', hours: 29, tasks: 15, role: 'member' },
          { id: 'demo-member-4-2', name: 'Arto', hours: 19, tasks: 10, role: 'member' },
          { id: 'demo-member-4-3', name: 'Eva', hours: 25, tasks: 13, role: 'member' },
          { id: 'demo-member-4-4', name: 'Getter', hours: 15, tasks: 8, role: 'sherpa' },
          { id: 'demo-member-4-5', name: 'Jarmo', hours: 21, tasks: 11, role: 'member' },
        ]
      }
    ]

    try {
      console.log('Demo groups with tasks:', demoGroups.map(g => ({ name: g.name, taskCount: g.tasks.length })))

      // Convert to DB format and insert
      const dbGroups = demoGroups.map(convertToDB)
      console.log('Converted groups to DB format:', dbGroups.length)

      await bulkInsertGroups(dbGroups)
      console.log('Bulk insert complete, refreshing groups...')

      await refreshGroups()
      console.log('Groups refreshed')

      setCurrentUserName('Alice Johnson')
      console.log('Demo data loaded successfully')
      alert('Demo data loaded successfully! 4 projects with tasks added.')
    } catch (e) {
      console.error('Error loading demo data:', e)
      const errorMessage = e instanceof Error ? e.message : 'Unknown error'
      alert(`Failed to load demo data: ${errorMessage}\n\nPlease ensure:\n1. Firestore is enabled in Firebase Console\n2. You have internet connection\n3. Firebase credentials are correct`)
    }
  }

  return (
    <GroupContext.Provider
      value={{
        groups,
        currentUserName,
        setCurrentUserName,
        createGroup,
        getGroup,
        joinGroup,
        addMember,
        updateMemberContribution,
        updateGroupSettings,
        loadDemoData,
        createTask,
        assignTask,
        updateTaskStatus,
        getTask,
        deleteTask,
        autoAssignTasks,
        loadCanvasMockData,
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}

export function useGroups() {
  const context = useContext(GroupContext)
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider')
  }
  return context
}
