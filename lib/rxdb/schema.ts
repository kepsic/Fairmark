import type { RxCollection, RxDocument } from 'rxdb'

// Document types (database representation)
export type GroupDocType = {
  id: string
  name: string
  description: string
  createdAt: string
}

export type MemberDocType = {
  id: string
  groupId: string
  name: string
  email: string
  role: 'member' | 'sherpa'
  joinedAt: string
}

export type TaskDocType = {
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
}

// RxDocument types
export type GroupDocument = RxDocument<GroupDocType>
export type MemberDocument = RxDocument<MemberDocType>
export type TaskDocument = RxDocument<TaskDocType>

// Collection types
export type GroupCollection = RxCollection<GroupDocType>
export type MemberCollection = RxCollection<MemberDocType>
export type TaskCollection = RxCollection<TaskDocType>

// Application types (with related data)
export type Member = MemberDocType

export type Task = TaskDocType

export type Group = GroupDocType & {
  members: Member[]
  tasks: Task[]
}
