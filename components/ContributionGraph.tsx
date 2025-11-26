'use client'

import { useMemo } from 'react'
import { calculateTaskFairness } from '@/lib/fairness'
import type { Member, Task } from '@/context/GroupContext'

interface ContributionGraphProps {
  members: Member[]
  tasks: Task[]
}

export default function ContributionGraph({ members, tasks }: ContributionGraphProps) {
  const { membersWithStats } = useMemo(
    () => calculateTaskFairness(members, tasks),
    [members, tasks]
  )

  const maxPercentage = useMemo(
    () => Math.max(...membersWithStats.map(m => m.percentage), 1),
    [membersWithStats]
  )

  return (
    <div className="w-full">
      <div className="space-y-4">
        {membersWithStats
          .sort((a, b) => b.percentage - a.percentage)
          .map(member => {
            const barWidth = (member.percentage / maxPercentage) * 100
            
            let barColor = 'bg-green-500'
            if (member.percentage > 50) {
              barColor = 'bg-red-500'
            } else if (member.percentage > 35) {
              barColor = 'bg-yellow-500'
            } else if (member.percentage < 10) {
              barColor = 'bg-gray-400'
            }

            return (
              <div key={member.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {member.name}
                    {member.role === 'sherpa' && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Sherpa
                      </span>
                    )}
                  </span>
                  <span className="text-gray-600">
                    {member.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                    style={{ width: `${barWidth}%` }}
                  >
                    {barWidth > 15 && (
                      <span className="text-xs text-white font-medium">
                        {member.totalHours}h
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 pl-1">
                  {member.taskHours > 0 && (
                    <span>Tasks: {member.taskHours}h</span>
                  )}
                  {member.taskHours > 0 && (member.manualHours > 0 || member.manualTasks > 0) && (
                    <span className="mx-1">•</span>
                  )}
                  {(member.manualHours > 0 || member.manualTasks > 0) && (
                    <span>Manual: {member.manualHours}h + {member.manualTasks} tasks</span>
                  )}
                </div>
              </div>
            )
          })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-xs font-medium text-gray-700 mb-2">Legend:</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Balanced (10-35%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>High (35-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Overworked (&gt;50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>Low (&lt;10%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
