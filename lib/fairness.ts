import { Member, Task } from '@/context/GroupContext'

/**
 * Calculate member contribution based on assigned tasks
 */
export function calculateTaskBasedContribution(member: Member, tasks: Task[]): number {
  const assignedTasks = tasks.filter(t => t.assignedTo === member.id)
  const taskHours = assignedTasks.reduce((sum, task) => sum + task.hours, 0)
  return taskHours
}

/**
 * Calculate fairness distribution for task-based system
 */
export function calculateTaskFairness(members: Member[], tasks: Task[]): {
  membersWithStats: Array<Member & { 
    taskHours: number
    manualHours: number
    manualTasks: number
    totalHours: number
    totalEffort: number
    percentage: number 
  }>
  totalEffort: number
  fairnessStatus: 'balanced' | 'slightly-unbalanced' | 'unbalanced'
} {
  // Calculate task-based hours for each member
  const membersWithStats = members.map(member => {
    const taskHours = calculateTaskBasedContribution(member, tasks)
    const manualHours = member.hours
    const manualTasks = member.tasks
    const manualContribution = manualHours + (manualTasks * 0.5)
    const totalEffort = taskHours + manualContribution
    const totalHours = taskHours + manualHours
    return {
      ...member,
      taskHours,
      manualHours,
      manualTasks,
      totalHours,
      totalEffort,
      percentage: 0
    }
  })

  const totalEffort = membersWithStats.reduce((sum, m) => sum + m.totalEffort, 0)

  // Calculate percentages
  const withPercentages = membersWithStats.map(m => ({
    ...m,
    percentage: totalEffort > 0 ? (m.totalEffort / totalEffort) * 100 : 0
  }))

  // Sort by percentage descending
  const sortedPercentages = withPercentages
    .map(m => m.percentage)
    .sort((a, b) => b - a)

  // Determine fairness status
  let fairnessStatus: 'balanced' | 'slightly-unbalanced' | 'unbalanced' = 'balanced'
  if (sortedPercentages.length > 0) {
    const topContributor = sortedPercentages[0]
    const topTwo = sortedPercentages[0] + (sortedPercentages[1] || 0)

    if (topContributor > 50) {
      fairnessStatus = 'unbalanced'
    } else if (topTwo > 80) {
      fairnessStatus = 'slightly-unbalanced'
    }
  }

  return {
    membersWithStats: withPercentages,
    totalEffort,
    fairnessStatus
  }
}
