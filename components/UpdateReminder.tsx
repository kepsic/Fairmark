'use client'

import type { Member, CheckIn } from '@/context/GroupContext'

type UpdateReminderProps = {
  members: Member[]
  checkIns: CheckIn[]
  onRemindMember?: (memberId: string) => void
}

function getWeeksAgo(lastUpdateStr: string | undefined): number {
  if (!lastUpdateStr) return 999 // Never updated

  const lastUpdate = new Date(lastUpdateStr)
  const now = new Date()
  const diffMs = now.getTime() - lastUpdate.getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))

  return diffWeeks
}

function getISOWeek(date: Date): string {
  const year = date.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}

export default function UpdateReminder({ members, checkIns, onRemindMember }: UpdateReminderProps) {
  const currentWeek = getISOWeek(new Date())

  // Find members who haven't checked in this week
  const membersNeedingUpdate = members.map(member => {
    const hasCheckedInThisWeek = checkIns.some(
      c => c.memberId === member.id && c.weekOf === currentWeek
    )
    const weeksAgo = getWeeksAgo(member.lastUpdateAt)

    return {
      ...member,
      hasCheckedInThisWeek,
      weeksAgo,
      needsReminder: !hasCheckedInThisWeek && weeksAgo >= 1,
      critical: weeksAgo >= 3, // 3+ weeks without update
    }
  })

  const activeReminders = membersNeedingUpdate.filter(m => m.needsReminder)

  if (activeReminders.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-sm font-semibold text-green-900">
              All team members are up to date!
            </p>
            <p className="text-xs text-green-700 mt-1">
              Everyone has submitted their weekly check-in for {currentWeek}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          ⏰ Update Reminders ({activeReminders.length})
        </h3>
        <p className="text-xs text-gray-500">Week: {currentWeek}</p>
      </div>

      {activeReminders.map(member => (
        <div
          key={member.id}
          className={`border rounded-lg p-3 ${
            member.critical
              ? 'border-red-300 bg-red-50'
              : 'border-yellow-300 bg-yellow-50'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  member.critical
                    ? 'bg-red-200 text-red-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                <p className="text-xs text-gray-600">
                  {member.weeksAgo === 999
                    ? 'Never updated'
                    : member.weeksAgo === 0
                    ? 'Last updated this week'
                    : `Last updated ${member.weeksAgo} week${member.weeksAgo !== 1 ? 's' : ''} ago`}
                </p>
              </div>
            </div>

            {member.critical && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
                ⚠️ CRITICAL
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs text-gray-700 flex-1">
              {member.critical
                ? '🚨 No activity for 3+ weeks. Please reach out to this team member.'
                : '⏰ Missing weekly check-in. A reminder might help!'}
            </p>

            {onRemindMember && (
              <button
                onClick={() => onRemindMember(member.id)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  member.critical
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                Send Reminder
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-blue-900 font-medium">💡 Participation Guidelines</p>
        <ul className="text-xs text-blue-800 mt-2 space-y-1 ml-4 list-disc">
          <li>Submit a weekly check-in to maintain your streak</li>
          <li>Missing 1-2 weeks: Yellow reminder (normal)</li>
          <li>Missing 3+ weeks: Red alert (critical - may affect contribution score)</li>
        </ul>
      </div>
    </div>
  )
}
