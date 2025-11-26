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

  const sortedMembers = useMemo(
    () => membersWithStats.sort((a, b) => b.percentage - a.percentage),
    [membersWithStats]
  )

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  // Calculate pie chart segments
  const pieSegments = useMemo(() => {
    let currentAngle = 0
    return sortedMembers.map((member, index) => {
      const angle = (member.percentage / 100) * 360
      const segment = {
        member,
        color: colors[index % colors.length],
        startAngle: currentAngle,
        angle: angle
      }
      currentAngle += angle
      return segment
    })
  }, [sortedMembers])

  const createPieSlice = (startAngle: number, angle: number, color: string, index: number) => {
    const radius = 80
    const centerX = 100
    const centerY = 100

    if (angle === 360) {
      return (
        <circle
          key={index}
          cx={centerX}
          cy={centerY}
          r={radius}
          fill={color}
        />
      )
    }

    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (startAngle + angle - 90) * (Math.PI / 180)

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return (
      <path
        key={index}
        d={path}
        fill={color}
        stroke="white"
        strokeWidth="2"
      />
    )
  }

  return (
    <div className="w-full">
      {/* Pie Chart */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex-shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {pieSegments.map((segment, index) =>
              createPieSlice(segment.startAngle, segment.angle, segment.color, index)
            )}
          </svg>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedMembers.map((member, index) => (
            <div key={member.id} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{member.name}</span>
                  {member.role === 'sherpa' && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded flex-shrink-0">
                      Sherpa
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600">
                  {member.percentage.toFixed(1)}% ({member.totalHours}h)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        {sortedMembers.map(member => {
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
                <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
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
