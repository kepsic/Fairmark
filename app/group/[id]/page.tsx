'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import ProgressBar from '@/components/ProgressBar'
import ContributionTable from '@/components/ContributionTable'
import ContributionGraph from '@/components/ContributionGraph'
import FairnessBadge from '@/components/FairnessBadge'
import TaskTable from '@/components/TaskTable'

export default function GroupDashboard({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getGroup, currentUserName, autoAssignTasks } = useGroups()
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
        <div className="max-w-xl mx-auto">
          <div className="rounded-lg border p-8 shadow-sm bg-white text-center">
            <h1 className="text-xl font-bold mb-2">Group Not Found</h1>
            <p className="text-gray-600 mb-4">
              The group you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/groups"
              className="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Back to Groups
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalLoggedTasks = group.members.reduce((sum, m) => sum + m.tasks, 0)

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/groups" className="text-blue-600 hover:underline text-sm">
            ← Back to groups
          </Link>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            Hi {currentUserName}, welcome to {group.name}
          </h1>
          {group.description && (
            <p className="text-gray-600">{group.description}</p>
          )}
        </div>

        {/* Progress Section */}
        <div className="rounded-lg border p-6 shadow-sm bg-white mb-6">
          <h2 className="text-lg font-semibold mb-4">Overall Progress</h2>
          <ProgressBar
            current={totalLoggedTasks}
            total={group.totalTasksNeeded}
          />
        </div>

        {/* Fairness Badge */}
        <div className="mb-6 flex justify-center">
          <FairnessBadge members={group.members} tasks={group.tasks} />
        </div>

        {/* Task Table */}
        <div className="rounded-lg border shadow-sm bg-white mb-6 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Project Tasks</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const assigned = autoAssignTasks(params.id)
                  if (assigned > 0) {
                    alert(`Auto-assigned ${assigned} unassigned task(s) to team members!`)
                  } else {
                    alert('No unassigned tasks to distribute.')
                  }
                }}
                className="text-sm bg-purple-600 text-white rounded-lg px-3 py-1 hover:bg-purple-700 transition-colors"
              >
                ⚡ Auto-Assign
              </button>
              <Link
                href={`/group/${params.id}/tasks/new`}
                className="text-sm bg-blue-600 text-white rounded-lg px-3 py-1 hover:bg-blue-700 transition-colors"
              >
                + New Task
              </Link>
            </div>
          </div>
          <TaskTable tasks={group.tasks} groupId={params.id} members={group.members} />
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

        {/* Contribution Table */}
        <div className="rounded-lg border shadow-sm bg-white mb-6 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Team Contributions</h2>
          </div>
          <ContributionTable members={group.members} tasks={group.tasks} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/group/${params.id}/contribute`}
            className="block w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-center font-medium hover:bg-blue-700 transition-colors"
          >
            Add Work
          </Link>

          <Link
            href={`/group/${params.id}/add-member`}
            className="block w-full bg-white border-2 border-blue-600 text-blue-600 rounded-lg px-4 py-3 text-center font-medium hover:bg-blue-50 transition-colors"
          >
            Add Member
          </Link>

          <Link
            href={`/group/${params.id}/settings`}
            className="block w-full bg-gray-200 text-gray-700 rounded-lg px-4 py-3 text-center font-medium hover:bg-gray-300 transition-colors"
          >
            Project Settings
          </Link>
        </div>

        {/* Group ID for sharing */}
        <div className="mt-6 rounded-lg border p-4 shadow-sm bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Share this Group ID:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-3 py-2 rounded border text-xs break-all">
              {group.id}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(group.id)}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
