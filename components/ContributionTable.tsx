import React from 'react'
import { Member, Task } from '@/context/GroupContext'
import { calculateTaskBasedContribution } from '@/lib/fairness'

type ContributionTableProps = {
  members: Member[]
  tasks?: Task[]
}

function ContributionTable({ members, tasks = [] }: ContributionTableProps) {
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
        <thead className="text-xs uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-3">Member</th>
            <th scope="col" className="px-4 py-3 text-right">Task Hours</th>
            <th scope="col" className="px-4 py-3 text-right">Manual Hours</th>
            <th scope="col" className="px-4 py-3 text-right">Manual Tasks</th>
            <th scope="col" className="px-4 py-3 text-right">Contribution %</th>
          </tr>
        </thead>
        <tbody>
          {membersWithPercentage.map((member) => (
            <tr key={member.id} className="border-b hover:bg-gray-50">
              <th scope="row" className="px-4 py-3 font-medium">
                {member.name}
                {member.role === 'sherpa' && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Sherpa
                  </span>
                )}
              </th>
              <td className="px-4 py-3 text-right text-blue-600 font-medium">{member.taskHours}h</td>
              <td className="px-4 py-3 text-right">{member.hours}h</td>
              <td className="px-4 py-3 text-right">{member.tasks}</td>
              <td className="px-4 py-3 text-right font-semibold" aria-label={`${member.name} contribution: ${member.percentage.toFixed(1)}%`}>
                {member.percentage.toFixed(1)}%
              </td>
            </tr>
          ))}
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
