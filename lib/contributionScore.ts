import type { Member, Task, CheckIn, PeerReview } from '@/context/GroupContext'

/**
 * Calculate comprehensive contribution score for each member
 * Combines multiple factors:
 * - Task hours (40%)
 * - Task count (20%)
 * - Work logs (15%)
 * - Weekly check-ins (10%)
 * - Peer reviews (15%)
 */
export function calculateContributionScores(
  members: Member[],
  tasks: Task[],
  checkIns: CheckIn[] = [],
  peerReviews: PeerReview[] = []
): Member[] {
  const membersWithScores = members.map(member => {
    let score = 0

    // 1. Task hours (40% weight)
    const memberTasks = tasks.filter(t => t.assignedTo === member.id)
    const totalHours = memberTasks.reduce((sum, t) => sum + t.hours, 0)
    const hoursScore = totalHours * 0.4

    // 2. Task count (20% weight)
    const taskCountScore = memberTasks.length * 0.2 * 5 // Multiply by 5 to scale up

    // 3. Work logs (15% weight) - active documentation and updates
    const workLogCount = memberTasks.reduce(
      (sum, t) => sum + (t.workLogs?.filter(wl => wl.author === member.name).length || 0),
      0
    )
    const workLogScore = workLogCount * 0.15 * 3 // Multiply by 3 to scale

    // 4. Weekly check-ins (10% weight) - consistent updates
    const memberCheckIns = checkIns.filter(c => c.memberId === member.id)
    const checkInScore = memberCheckIns.length * 0.1 * 10 // Multiply by 10 to scale

    // 5. Peer reviews (15% weight) - team perception
    const memberReviews = peerReviews.filter(r => r.reviewedMemberId === member.id)
    let peerScore = 0
    if (memberReviews.length > 0) {
      const avgPeerRating = memberReviews.reduce((sum, r) => sum + r.score, 0) / memberReviews.length
      peerScore = avgPeerRating * 0.15 * 4 // Scale to match other metrics
    }

    score = hoursScore + taskCountScore + workLogScore + checkInScore + peerScore

    return {
      ...member,
      contributionScore: Math.round(score * 10) / 10, // Round to 1 decimal
    }
  })

  return membersWithScores
}

/**
 * Calculate streak for a member based on check-ins
 * A streak is maintained if there's at least one check-in per week
 */
export function calculateStreak(memberId: string, checkIns: CheckIn[]): number {
  const memberCheckIns = checkIns
    .filter(c => c.memberId === memberId)
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf)) // Most recent first

  if (memberCheckIns.length === 0) return 0

  let streak = 0
  let currentWeek = getISOWeek(new Date())

  for (let i = 0; i < 52; i++) {
    // Check up to 1 year back
    const hasCheckIn = memberCheckIns.some(c => c.weekOf === currentWeek)
    if (hasCheckIn) {
      streak++
      currentWeek = getPreviousWeek(currentWeek)
    } else {
      break
    }
  }

  return streak
}

/**
 * Determine which badges a member should earn based on their activity
 */
export function calculateBadges(
  member: Member,
  tasks: Task[],
  checkIns: CheckIn[],
  peerReviews: PeerReview[]
): Array<{ type: 'reliable' | 'clarity-champion' | 'on-time-hero' | 'team-player' | 'innovator'; earnedAt: string; description: string }> {
  const badges: Array<{ type: 'reliable' | 'clarity-champion' | 'on-time-hero' | 'team-player' | 'innovator'; earnedAt: string; description: string }> = []
  const now = new Date().toISOString()

  const memberTasks = tasks.filter(t => t.assignedTo === member.id)
  const memberCheckIns = checkIns.filter(c => c.memberId === member.id)
  const memberReviews = peerReviews.filter(r => r.reviewedMemberId === member.id)

  // Reliable: 4+ weeks of consistent check-ins
  const streak = calculateStreak(member.id, checkIns)
  if (streak >= 4) {
    badges.push({
      type: 'reliable',
      earnedAt: now,
      description: `${streak} week check-in streak`,
    })
  }

  // Clarity Champion: All tasks have work logs
  const tasksWithLogs = memberTasks.filter(t => t.workLogs && t.workLogs.length > 0).length
  if (memberTasks.length > 0 && tasksWithLogs === memberTasks.length) {
    badges.push({
      type: 'clarity-champion',
      earnedAt: now,
      description: 'Documents all tasks thoroughly',
    })
  }

  // On-Time Hero: 90%+ of tasks completed
  const completedTasks = memberTasks.filter(t => t.status === 'done').length
  if (memberTasks.length >= 3 && completedTasks / memberTasks.length >= 0.9) {
    badges.push({
      type: 'on-time-hero',
      earnedAt: now,
      description: `${completedTasks}/${memberTasks.length} tasks completed`,
    })
  }

  // Team Player: Average peer rating 4+
  if (memberReviews.length >= 2) {
    const avgRating = memberReviews.reduce((sum, r) => sum + r.score, 0) / memberReviews.length
    if (avgRating >= 4) {
      badges.push({
        type: 'team-player',
        earnedAt: now,
        description: `${avgRating.toFixed(1)}/5 peer rating`,
      })
    }
  }

  return badges
}

// Helper functions
function getISOWeek(date: Date): string {
  const year = date.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}

function getPreviousWeek(weekString: string): string {
  const [year, week] = weekString.split('-W').map(Number)
  if (week === 1) {
    return `${year - 1}-W52`
  }
  return `${year}-W${(week - 1).toString().padStart(2, '0')}`
}
