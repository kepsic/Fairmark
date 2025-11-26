'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import FairnessBadge from '@/components/FairnessBadge'
import ContributionTable from '@/components/ContributionTable'
import ContributionGraph from '@/components/ContributionGraph'
import TaskTable from '@/components/TaskTable'
import { calculateTaskFairness } from '@/lib/fairness'

export default function TeacherProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getGroup, currentUserName } = useGroups()
  const group = getGroup(params.id)

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  if (!currentUserName) {
    return null
  }

  if (!group) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border p-8 shadow-sm bg-white text-center">
            <h1 className="text-xl font-bold mb-2">Project Not Found</h1>
            <Link
              href="/teacher/projects"
              className="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { membersWithStats, totalEffort, fairnessStatus } = calculateTaskFairness(group.members, group.tasks)

  // Find overworked members (>50%)
  const overworkedMembers = membersWithStats.filter(m => m.percentage > 50)

  // Find underworked members (<10%)
  const underworkedMembers = membersWithStats.filter(m => m.percentage < 10 && totalEffort > 0)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/teacher/projects" className="text-blue-600 hover:underline text-sm">
            ← Back to all projects
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
          {group.description && (
            <p className="text-gray-600">{group.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Project Lead: <span className="font-medium">{group.projectLead || 'N/A'}</span>
          </p>
        </div>

        {/* Fairness Alert */}
        {fairnessStatus !== 'balanced' && (
          <div className={`rounded-lg border-2 p-4 mb-6 ${
            fairnessStatus === 'unbalanced' 
              ? 'bg-red-50 border-red-300' 
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-bold mb-2">
                  {fairnessStatus === 'unbalanced' ? 'Fairness Warning' : 'Fairness Advisory'}
                </h3>
                <p className="text-sm mb-3">
                  {fairnessStatus === 'unbalanced' 
                    ? 'This project has a significantly unbalanced workload distribution.'
                    : 'This project shows signs of workload imbalance.'
                  }
                </p>
                {overworkedMembers.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Overworked members:</p>
                    <ul className="list-disc list-inside text-sm">
                      {overworkedMembers.map(m => (
                        <li key={m.id}>
                          {m.name}: {m.percentage.toFixed(1)}% of total work
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {underworkedMembers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Undercontributing members:</p>
                    <ul className="list-disc list-inside text-sm">
                      {underworkedMembers.map(m => (
                        <li key={m.id}>
                          {m.name}: {m.percentage.toFixed(1)}% of total work
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fairness Badge */}
        <div className="mb-6 flex justify-center">
          <FairnessBadge members={group.members} tasks={group.tasks} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Team Members</p>
            <p className="text-2xl font-bold">{group.members.length}</p>
          </div>
          <div className="rounded-lg border p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
            <p className="text-2xl font-bold">{group.tasks.length}</p>
          </div>
          <div className="rounded-lg border p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Completion</p>
            <p className="text-2xl font-bold">
              {group.tasks.length > 0 
                ? Math.round((group.tasks.filter(t => t.status === 'done').length / group.tasks.length) * 100)
                : 0}%
            </p>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="rounded-lg border shadow-sm bg-white mb-6 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Contribution Distribution</h2>
          </div>
          <div className="p-4">
            <ContributionGraph members={group.members} tasks={group.tasks} />
          </div>
        </div>

        {/* Tasks */}
        <div className="rounded-lg border shadow-sm bg-white mb-6 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Project Tasks</h2>
          </div>
          <TaskTable tasks={group.tasks} groupId={params.id} members={group.members} />
        </div>

        {/* Contributions */}
        <div className="rounded-lg border shadow-sm bg-white mb-6 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Member Contributions</h2>
          </div>
          <ContributionTable members={group.members} tasks={group.tasks} />
        </div>

        {/* Grading Recommendations */}
        <div className="rounded-lg border p-6 shadow-sm bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold mb-3">📊 Grading Recommendations</h2>
          <p className="text-sm text-gray-700 mb-4">
            Based on contribution percentages, consider individual grade adjustments:
          </p>
          <div className="space-y-2">
            {membersWithStats
              .sort((a, b) => b.percentage - a.percentage)
              .map(member => {
                let recommendation = ''
                let colorClass = ''
                
                if (member.percentage > 40) {
                  recommendation = 'Consider grade bonus for exceptional contribution'
                  colorClass = 'text-green-700'
                } else if (member.percentage < 15 && totalEffort > 0) {
                  recommendation = 'Consider grade penalty for low contribution'
                  colorClass = 'text-red-700'
                } else {
                  recommendation = 'Standard grade appropriate'
                  colorClass = 'text-gray-700'
                }

                return (
                  <div key={member.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {member.name}
                      {member.role === 'sherpa' && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Sherpa
                        </span>
                      )}
                    </span>
                    <span className="text-gray-600">{member.percentage.toFixed(1)}%</span>
                    <span className={`${colorClass} italic flex-1 text-right`}>
                      {recommendation}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
