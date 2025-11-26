// Firebase document types
export type UserDoc = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type GroupDoc = {
  id: string
  name: string
  description: string
  createdAt: string
}

export type MemberDoc = {
  id: string
  groupId: string
  name: string
  email: string
  role: 'member' | 'sherpa'
  joinedAt: string
}

export type WorkLog = {
  id: string
  author: string
  content: string
  createdAt: string
  hoursSpent?: number
}

export type TaskDoc = {
  id: string
  groupId: string
  title: string
  description: string
  assignedTo: string | null
  status: 'todo' | 'in-progress' | 'done'
  estimatedHours: number
  actualHours: number
  createdAt: string
  updatedAt: string
  workLogs?: WorkLog[]
}

// Combined group with members and tasks
export type GroupWithData = GroupDoc & {
  members: MemberDoc[]
  tasks: TaskDoc[]
}
