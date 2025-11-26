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

  // Badge system based on contribution analysis
  const avgTaskHours = membersWithPercentage.length > 0
    ? membersWithPercentage.reduce((sum, m) => sum + m.taskHours, 0) / membersWithPercentage.length
    : 0

  // Heavy Lifter: Highest task hours (at least 25% above average)
  const heavyLifter = membersWithPercentage.length > 0
    ? membersWithPercentage.reduce((max, current) => 
        current.taskHours > max.taskHours ? current : max
      , membersWithPercentage[0])
    : null

  const isHeavyLifter = (memberId: string) => {
    if (!heavyLifter || heavyLifter.taskHours === 0) return false
    return heavyLifter.id === memberId && heavyLifter.taskHours >= avgTaskHours * 1.25
  }

  // Balanced Contributor: Within 10% of average (good team player)
  const isBalancedContributor = (member: typeof membersWithPercentage[0]) => {
    if (avgTaskHours === 0) return false
    const deviation = Math.abs(member.taskHours - avgTaskHours) / avgTaskHours
    return deviation <= 0.1 && member.taskHours > 0
  }

  // Needs Support: Significantly below average (less than 50% of average)
  const needsSupport = (member: typeof membersWithPercentage[0]) => {
    if (avgTaskHours === 0) return false
    return member.taskHours > 0 && member.taskHours < avgTaskHours * 0.5
  }

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
                  <div className="flex items-center gap-2 flex-wrap">
                    {isSelected && (
                      <span className="text-blue-600 font-bold">→</span>
                    )}
                    <span>{member.name}</span>
                    
                    {/* Role Badge */}
                    {member.role === 'sherpa' && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">
                        Sherpa
                      </span>
                    )}
                    
                    {/* Performance Badges */}
                    {isHeavyLifter(member.id) && (
                      <span 
                        className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-semibold flex items-center gap-1"
                        title={`${member.name} is carrying the team with ${member.taskHours}h of work!`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        Heavy Lifter
                      </span>
                    )}
                    
                    {!isHeavyLifter(member.id) && isBalancedContributor(member) && (
                      <span 
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold flex items-center gap-1"
                        title={`${member.name} is contributing evenly to the team`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Balanced
                      </span>
                    )}
                    
                    {needsSupport(member) && (
                      <span 
                        className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold flex items-center gap-1"
                        title={`${member.name} might need support or more tasks`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Needs Support
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
