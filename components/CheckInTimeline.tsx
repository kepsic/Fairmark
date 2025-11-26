'use client'

import type { CheckIn } from '@/context/GroupContext'

type CheckInTimelineProps = {
  checkIns: CheckIn[]
  groupMembers: Array<{ id: string; name: string }>
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CheckInTimeline({ checkIns, groupMembers }: CheckInTimelineProps) {
  // Sort check-ins by date, most recent first
  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Group by week
  const byWeek = sortedCheckIns.reduce((acc, checkIn) => {
    if (!acc[checkIn.weekOf]) {
      acc[checkIn.weekOf] = []
    }
    acc[checkIn.weekOf].push(checkIn)
    return acc
  }, {} as Record<string, CheckIn[]>)

  const weeks = Object.keys(byWeek).sort().reverse()

  if (sortedCheckIns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">No check-ins yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Team members can submit weekly check-ins to share progress
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {weeks.map(week => (
        <div key={week} className="border-l-2 border-blue-200 pl-4 ml-2">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-900">{week}</h4>
            <p className="text-xs text-gray-500">
              {byWeek[week].length} check-in{byWeek[week].length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4">
            {byWeek[week].map(checkIn => (
              <div
                key={checkIn.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative"
              >
                {/* Avatar dot on the timeline */}
                <div className="absolute -left-[25px] top-6 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                      {checkIn.memberName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{checkIn.memberName}</p>
                      <p className="text-xs text-gray-500">{formatDate(checkIn.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-green-700 mb-1">✅ What I accomplished:</p>
                    <p className="text-gray-700 pl-4">{checkIn.whatDidIDo}</p>
                  </div>

                  {checkIn.whatBlockedMe && checkIn.whatBlockedMe !== 'Nothing' && (
                    <div>
                      <p className="font-semibold text-orange-700 mb-1">⚠️ What blocked me:</p>
                      <p className="text-gray-700 pl-4">{checkIn.whatBlockedMe}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-blue-700 mb-1">🎯 What I&apos;ll do next:</p>
                    <p className="text-gray-700 pl-4">{checkIn.whatWillIDoNext}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
