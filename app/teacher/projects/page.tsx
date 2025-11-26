'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import GroupCard from '@/components/GroupCard'

export default function TeacherProjectsPage() {
  const router = useRouter()
  const { groups, currentUserName } = useGroups()

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  if (!currentUserName) {
    return null
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/groups" className="text-blue-600 hover:underline text-sm">
            ← Back to student view
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor all projects and assess team fairness
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-blue-600">{groups.length}</p>
          </div>
          <div className="rounded-lg border p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-green-600">
              {groups.reduce((sum, g) => sum + g.members.length, 0)}
            </p>
          </div>
          <div className="rounded-lg border p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-purple-600">
              {groups.reduce((sum, g) => sum + g.tasks.length, 0)}
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Projects</h2>
          {groups.length === 0 ? (
            <div className="rounded-lg border p-8 shadow-sm bg-white text-center">
              <p className="text-gray-500">No projects yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => {
                // Calculate fairness for teacher view
                const taskHours = group.members.map(m => {
                  const assigned = group.tasks.filter(t => t.assignedTo === m.id)
                  return assigned.reduce((sum, t) => sum + t.hours, 0)
                })
                const totalHours = taskHours.reduce((sum, h) => sum + h, 0)
                const maxContribution = totalHours > 0 
                  ? Math.max(...taskHours.map(h => (h / totalHours) * 100))
                  : 0

                return (
                  <Link key={group.id} href={`/teacher/project/${group.id}`}>
                    <div className="rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{group.name}</h3>
                          {group.description && (
                            <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                          )}
                        </div>
                        {maxContribution > 50 && (
                          <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                            ⚠️ Unbalanced
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                        <span>{group.members.length} members</span>
                        <span>•</span>
                        <span>{group.tasks.length} tasks</span>
                        <span>•</span>
                        <span>Lead: {group.projectLead || 'N/A'}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
