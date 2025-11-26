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

export type MemberRole = 'member' | 'sherpa' | 'writer' | 'presenter' | 'coordinator' | 'researcher' | 'qa' | 'designer'

export type MemberDoc = {
  id: string
  groupId: string
  name: string
  email: string
  role: 'member' | 'sherpa'
  assignedRoles?: MemberRole[] // Support multiple functional roles
  joinedAt: string
  lastUpdateAt?: string // Track last contribution
  streakWeeks?: number // Weekly update streak
}

export type WorkLog = {
  id: string
  author: string
  content: string
  createdAt: string
  hoursSpent?: number
}

export type CheckIn = {
  id: string
  memberId: string
  memberName: string
  weekOf: string // ISO week string, e.g., '2025-W48'
  whatDidIDo: string
  whatBlockedMe: string
  whatWillIDoNext: string
  createdAt: string
}

export type Badge = {
  id: string
  type: 'reliable' | 'clarity-champion' | 'on-time-hero' | 'team-player' | 'innovator'
  earnedAt: string
  description: string
}

export type PeerReview = {
  id: string
  reviewerId: string // Anonymous reference
  reviewedMemberId: string
  score: number // 1-5 scale
  comment?: string
  createdAt: string
  weekOf: string
}

export type Meeting = {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  attendees: string[]
  createdBy: string
  createdAt: string
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
  checkIns?: CheckIn[]
  peerReviews?: PeerReview[]
  meetings?: Meeting[]
}
