'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Role = 'member' | 'sherpa'

export type Member = {
  id: string
  name: string
  hours: number
  tasks: number
  role?: Role
}

export type TaskStatus = 'todo' | 'in-progress' | 'done'

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

type GroupContextType = {
  groups: Group[]
  currentUserName: string | null
  setCurrentUserName: (name: string) => void
  createGroup: (name: string, description?: string) => string
  getGroup: (id: string) => Group | undefined
  joinGroup: (groupId: string, userName: string) => boolean
  addMember: (groupId: string, memberName: string, role?: Role) => void
  updateMemberContribution: (groupId: string, memberId: string, hours: number, tasks: number) => void
  updateGroupSettings: (groupId: string, name: string, description: string, totalTasksNeeded: number) => void
  loadDemoData: () => void
  // Task management
  createTask: (groupId: string, title: string, description: string, hours: number) => string
  assignTask: (groupId: string, taskId: string, memberId: string | null) => void
  updateTaskStatus: (groupId: string, taskId: string, status: TaskStatus) => void
  getTask: (groupId: string, taskId: string) => Task | undefined
  deleteTask: (groupId: string, taskId: string) => void
  autoAssignTasks: (groupId: string) => number
  loadCanvasMockData: () => void
}

const GroupContext = createContext<GroupContextType | undefined>(undefined)

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([])
  const [currentUserName, setCurrentUserNameState] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    setIsClient(true)
    try {
      const storedGroups = localStorage.getItem('fairGroupworkGroups')
      const storedUserName = localStorage.getItem('currentUserName')
      
      if (storedGroups) {
        try {
          const parsed = JSON.parse(storedGroups)
          // Validate that parsed data is an array
          if (Array.isArray(parsed)) {
            setGroups(parsed)
          } else {
            console.warn('Invalid groups data in localStorage, resetting')
            localStorage.removeItem('fairGroupworkGroups')
          }
        } catch (e) {
          console.error('Error parsing groups from localStorage', e)
          localStorage.removeItem('fairGroupworkGroups')
        }
      }
      
      if (storedUserName) {
        setCurrentUserNameState(storedUserName)
      }
    } catch (e) {
      console.error('Error accessing localStorage', e)
    }
  }, [])

  // Save groups to localStorage whenever they change
  useEffect(() => {
    if (isClient && groups.length >= 0) {
      try {
        localStorage.setItem('fairGroupworkGroups', JSON.stringify(groups))
      } catch (e) {
        console.error('Error saving groups to localStorage', e)
        // Handle quota exceeded error
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          alert('Storage quota exceeded. Please clear some data.')
        }
      }
    }
  }, [groups, isClient])

  const setCurrentUserName = (name: string) => {
    setCurrentUserNameState(name)
    localStorage.setItem('currentUserName', name)
  }

  const createGroup = (name: string, description?: string): string => {
    const groupId = crypto.randomUUID()
    const memberId = crypto.randomUUID()
    
    const newGroup: Group = {
      id: groupId,
      name,
      description,
      members: [
        {
          id: memberId,
          name: currentUserName || 'Unknown',
          hours: 0,
          tasks: 0,
          role: 'member',
        }
      ],
      tasks: [],
      totalTasksNeeded: 10, // Default value
      projectLead: currentUserName || undefined,
    }
    
    setGroups(prev => [...prev, newGroup])
    return groupId
  }

  const getGroup = (id: string): Group | undefined => {
    return groups.find(g => g.id === id)
  }

  const joinGroup = (groupId: string, userName: string): boolean => {
    const group = groups.find(g => g.id === groupId)
    if (!group) return false
    
    // Check if user already in group
    const alreadyMember = group.members.some(m => m.name === userName)
    if (alreadyMember) return true
    
    const memberId = crypto.randomUUID()
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: [
            ...g.members,
            {
              id: memberId,
              name: userName,
              hours: 0,
              tasks: 0,
              role: 'member' as Role,
            }
          ]
        }
      }
      return g
    })
    
    setGroups(updatedGroups)
    return true
  }

  const addMember = (groupId: string, memberName: string, role: Role = 'member') => {
    const memberId = crypto.randomUUID()
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        // Check if member with same name already exists
        const existingMember = g.members.find(m => m.name === memberName)
        if (existingMember) {
          console.warn(`Member "${memberName}" already exists in group`)
          return g // Don't add duplicate
        }
        
        return {
          ...g,
          members: [
            ...g.members,
            {
              id: memberId,
              name: memberName,
              hours: 0,
              tasks: 0,
              role,
            }
          ]
        }
      }
      return g
    })
    
    setGroups(updatedGroups)
  }

  const updateMemberContribution = (
    groupId: string,
    memberId: string,
    hours: number,
    tasks: number
  ) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.map(m => {
            if (m.id === memberId) {
              return {
                ...m,
                hours: m.hours + hours,
                tasks: m.tasks + tasks,
              }
            }
            return m
          })
        }
      }
      return g
    })
    
    setGroups(updatedGroups)
  }

  const updateGroupSettings = (
    groupId: string,
    name: string,
    description: string,
    totalTasksNeeded: number
  ) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          name,
          description,
          totalTasksNeeded,
        }
      }
      return g
    })
    
    setGroups(updatedGroups)
  }

  // Task management methods
  const createTask = (groupId: string, title: string, description: string, hours: number): string => {
    const taskId = crypto.randomUUID()
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          tasks: [
            ...g.tasks,
            {
              id: taskId,
              title,
              description,
              assignedTo: null,
              hours,
              status: 'todo' as TaskStatus,
            }
          ]
        }
      }
      return g
    })
    setGroups(updatedGroups)
    return taskId
  }

  const assignTask = (groupId: string, taskId: string, memberId: string | null) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          tasks: g.tasks.map(t => 
            t.id === taskId ? { ...t, assignedTo: memberId } : t
          )
        }
      }
      return g
    })
    setGroups(updatedGroups)
  }

  const updateTaskStatus = (groupId: string, taskId: string, status: TaskStatus) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          tasks: g.tasks.map(t => 
            t.id === taskId ? { ...t, status } : t
          )
        }
      }
      return g
    })
    setGroups(updatedGroups)
  }

  const getTask = (groupId: string, taskId: string): Task | undefined => {
    const group = getGroup(groupId)
    return group?.tasks.find(t => t.id === taskId)
  }

  const deleteTask = (groupId: string, taskId: string) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          tasks: g.tasks.filter(t => t.id !== taskId)
        }
      }
      return g
    })
    setGroups(updatedGroups)
  }

  const autoAssignTasks = (groupId: string): number => {
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
    let assignedCount = 0
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        const updatedTasks = g.tasks.map(task => {
          if (task.assignedTo === null) {
            // Assign to member with least current workload
            const assignTo = memberWorkload[assignedCount % memberWorkload.length]
            assignedCount++
            
            // Update workload tracker
            assignTo.currentHours += task.hours
            memberWorkload.sort((a, b) => a.currentHours - b.currentHours)
            
            return {
              ...task,
              assignedTo: assignTo.memberId
            }
          }
          return task
        })
        
        return {
          ...g,
          tasks: updatedTasks
        }
      }
      return g
    }))

    return unassignedTasks.length
  }

  const loadCanvasMockData = () => {
    // Clear localStorage to ensure fresh Canvas data
    localStorage.removeItem('fairGroupworkGroups')
    
    const canvasGroup: Group = {
      id: 'canvas-mock-1',
      name: 'SaaS Platform MVP',
      description: 'Mock project loaded from Canvas LMS demonstrating fairness issues',
      totalTasksNeeded: 33,
      projectLead: 'Alice',
      tasks: [
        { id: 'task-1', title: 'Wireframes', description: 'Design UI wireframes for all pages', assignedTo: 'member-alice', hours: 8, status: 'done' },
        { id: 'task-2', title: 'API Design', description: 'REST API design and documentation', assignedTo: 'member-bob', hours: 4, status: 'done' },
        { id: 'task-3', title: 'UI Components', description: 'Build reusable React components', assignedTo: 'member-alice', hours: 6, status: 'in-progress' },
        { id: 'task-4', title: 'Testing', description: 'Unit and integration tests', assignedTo: 'member-charlie', hours: 3, status: 'todo' },
        { id: 'task-5', title: 'User Stories', description: 'Write user stories and acceptance criteria', assignedTo: 'member-diana', hours: 5, status: 'done' },
        { id: 'task-6', title: 'Deployment', description: 'Set up CI/CD and deploy to production', assignedTo: 'member-alice', hours: 7, status: 'todo' },
      ],
      members: [
        { id: 'member-alice', name: 'Alice', hours: 21, tasks: 3, role: 'member' },
        { id: 'member-bob', name: 'Bob', hours: 4, tasks: 1, role: 'member' },
        { id: 'member-charlie', name: 'Charlie', hours: 3, tasks: 1, role: 'member' },
        { id: 'member-diana', name: 'Diana', hours: 5, tasks: 1, role: 'sherpa' },
      ]
    }
    
    setGroups([canvasGroup])
    setCurrentUserName('Alice')
  }

  const loadDemoData = () => {
    // Clear localStorage to ensure fresh demo data
    localStorage.removeItem('fairGroupworkGroups')
    
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
      }
    ]
    
    setGroups(demoGroups)
    setCurrentUserName('Alice Johnson')
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
