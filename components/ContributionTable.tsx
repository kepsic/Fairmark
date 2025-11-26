import React from 'react'
import { Member, Task } from '@/context/GroupContext'
import { calculateTaskBasedContribution } from '@/lib/fairness'

type ContributionTableProps = {
  members: Member[]
  tasks?: Task[]
  onMemberClick?: (memberId: string) => void
  selectedMemberId?: string | null
}

function ContributionTable({ members, tasks = [], onMemberClick, selectedMemberId }: ContributionTableProps) {
  // Calculate scores and percentages (hybrid: task-based + manual)
  const membersWithStats = members.map(member => {
    const taskHours = calculateTaskBasedContribution(member, tasks)
    const manualScore = member.hours + member.tasks * 0.5
    const totalScore = taskHours + manualScore
    return { ...member, taskHours, manualScore, score: totalScore }
  })

  const totalScore = membersWithStats.reduce((sum, m) => sum + m.score, 0)

  const membersWithPercentage = membersWithStats.map(member => ({
    ...member,
    percentage: totalScore > 0 ? (member.score / totalScore) * 100 : 0
  }))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left" aria-label="Team member contributions">
        <caption className="sr-only">
          Team member contributions showing hours worked, tasks completed, and contribution percentage
        </caption>
        <thead className="text-xs uppercase bg-[#003A79] text-white">
          <tr>
            <th scope="col" className="px-4 py-3">Member</th>
            <th scope="col" className="px-4 py-3 text-right">Task Hours</th>
            <th scope="col" className="px-4 py-3 text-right">Manual Hours</th>
            <th scope="col" className="px-4 py-3 text-right">Manual Tasks</th>
            <th scope="col" className="px-4 py-3 text-right">Contribution %</th>
          </tr>
        </thead>
        <tbody>
          {membersWithPercentage.map((member) => {
            const isSelected = selectedMemberId === member.id
            const isClickable = !!onMemberClick

            return (
              <tr 
                key={member.id} 
                onClick={() => onMemberClick?.(member.id)}
                className={`border-b border-gray-300 ${
                  isSelected 
                    ? 'bg-blue-100 hover:bg-blue-200' 
                    : 'odd:bg-white even:bg-[#F5F5F5] hover:bg-gray-100'
                } ${isClickable ? 'cursor-pointer' : ''} transition-colors`}
              >
                <th scope="row" className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="text-blue-600 font-bold">→</span>
                    )}
                    <span>{member.name}</span>
                    {member.role === 'sherpa' && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Sherpa
                      </span>
                    )}
                  </div>
                </th>
                <td className={`px-4 py-3 text-right font-medium ${isSelected ? 'text-blue-700' : 'text-[#005BB5]'}`}>
                  {member.taskHours}h
                </td>
                <td className="px-4 py-3 text-right">{member.hours}h</td>
                <td className="px-4 py-3 text-right">{member.tasks}</td>
                <td className="px-4 py-3 text-right font-semibold" aria-label={`${member.name} contribution: ${member.percentage.toFixed(1)}%`}>
                  {member.percentage.toFixed(1)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {members.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No members yet. Add members to get started!
        </div>
      )}
    </div>
  )
}

export default React.memo(ContributionTable)
