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
      <div className="p-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4 text-center">
            <h1 className="text-xl font-bold mb-2 text-[#003A79]">Project Not Found</h1>
            <p className="text-[#333333] mb-4">
              The project you are looking for does not exist.
            </p>
            <Link
              href="/groups"
              className="inline-block bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalLoggedTasks = group.members.reduce((sum, m) => sum + m.tasks, 0)

  return (
    <div className="p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/groups" className="text-[#005BB5] hover:underline text-sm">
            ← Back to projects
          </Link>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1 text-[#003A79]">
            {group.name}
          </h1>
          {group.description && (
            <p className="text-[#333333]">{group.description}</p>
          )}
        </div>

        {/* Progress Section */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 text-[#003A79]">Overall Progress</h2>
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
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg mb-4 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-[#003A79]">Project Tasks</h2>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const assigned = await autoAssignTasks(params.id)
                  if (assigned > 0) {
                    alert(`Auto-assigned ${assigned} unassigned tasks to team members.`)
                  } else {
                    alert('No unassigned tasks to distribute.')
                  }
                }}
                className="text-sm bg-[#003A79] text-white font-semibold rounded-md px-3 py-1 hover:bg-[#002d5c] transition"
              >
                Auto-Assign
              </button>
              <Link
                href={`/group/${params.id}/tasks/new`}
                className="text-sm bg-[#D4A017] text-white font-semibold rounded-md px-3 py-1 hover:bg-[#b58912] transition"
              >
                New Task
              </Link>
            </div>
          </div>
          <TaskTable tasks={group.tasks} groupId={params.id} members={group.members} />
        </div>

        {/* Contribution Graph */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg mb-4 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-[#003A79]">Contribution Distribution</h2>
          </div>
          <div className="p-4">
            <ContributionGraph members={group.members} tasks={group.tasks} />
          </div>
        </div>

        {/* Contribution Table */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg mb-4 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-[#003A79]">Team Contributions</h2>
          </div>
          <ContributionTable members={group.members} tasks={group.tasks} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/group/${params.id}/contribute`}
            className="block w-full bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition text-center"
          >
            Add Work
          </Link>

          <Link
            href={`/group/${params.id}/add-member`}
            className="block w-full border border-[#003A79] text-[#003A79] px-5 py-2 rounded-md hover:bg-[#003A79] hover:text-white transition text-center font-semibold"
          >
            Add Member
          </Link>

          <Link
            href={`/group/${params.id}/settings`}
            className="block w-full bg-gray-200 text-gray-700 rounded-md px-4 py-3 text-center font-medium hover:bg-gray-300 transition"
          >
            Project Settings
          </Link>
        </div>

        {/* Group ID for sharing */}
        <div className="mt-6 bg-white border border-gray-200 shadow-sm rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-[#333333] mb-2">Share this Project ID:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-3 py-2 rounded border text-xs break-all">
              {group.id}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(group.id)}
              className="bg-[#005BB5] text-white px-3 py-2 rounded text-sm hover:bg-[#004a99] transition whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
