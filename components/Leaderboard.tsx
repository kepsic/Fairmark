'use client'

import type { Member } from '@/context/GroupContext'

type LeaderboardProps = {
  members: Member[]
}

const BADGE_ICONS: Record<string, { emoji: string; color: string; label: string }> = {
  'reliable': { emoji: '🔥', color: 'orange', label: 'Reliable' },
  'clarity-champion': { emoji: '📝', color: 'blue', label: 'Clarity Champion' },
  'on-time-hero': { emoji: '⚡', color: 'yellow', label: 'On-Time Hero' },
  'team-player': { emoji: '🤝', color: 'green', label: 'Team Player' },
  'innovator': { emoji: '💡', color: 'purple', label: 'Innovator' },
}

export default function Leaderboard({ members }: LeaderboardProps) {
  // Sort by contribution score (highest first)
  const rankedMembers = [...members].sort(
    (a, b) => (b.contributionScore || 0) - (a.contributionScore || 0)
  )

  const maxScore = rankedMembers[0]?.contributionScore || 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🏆 Team Leaderboard</h3>
        <p className="text-xs text-gray-500">
          Based on tasks, hours, check-ins & peer reviews
        </p>
      </div>

      {rankedMembers.map((member, index) => {
        const scorePercent = maxScore > 0 ? (member.contributionScore || 0) / maxScore * 100 : 0
        const isTopThree = index < 3

        return (
          <div
            key={member.id}
            className={`border rounded-lg p-4 transition-all ${
              isTopThree
                ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-white shadow-md'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {/* Rank Badge */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0
                    ? 'bg-yellow-400 text-yellow-900'
                    : index === 1
                    ? 'bg-gray-300 text-gray-700'
                    : index === 2
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>

              {/* Member Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  {member.streakWeeks && member.streakWeeks > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      🔥 {member.streakWeeks}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  {member.tasks} tasks • {member.hours}h
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {member.contributionScore?.toFixed(1) || '0.0'}
                </p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                  isTopThree ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-blue-500'
                }`}
                style={{ width: `${scorePercent}%` }}
              ></div>
            </div>

            {/* Badges */}
            {member.badges && member.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {member.badges.map((badge, idx) => {
                  const badgeInfo = BADGE_ICONS[badge.type] || {
                    emoji: '🏅',
                    color: 'gray',
                    label: badge.type,
                  }
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 px-2 py-1 bg-${badgeInfo.color}-100 text-${badgeInfo.color}-800 rounded-full text-xs font-medium`}
                      title={badge.description}
                    >
                      {badgeInfo.emoji} {badgeInfo.label}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* No Data State */}
      {rankedMembers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No members yet</p>
        </div>
      )}
    </div>
  )
}
