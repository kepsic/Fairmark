'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'

export default function SettingsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getGroup, currentUserName, updateGroupSettings } = useGroups()
  const group = getGroup(params.id)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [totalTasksNeeded, setTotalTasksNeeded] = useState('')

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  useEffect(() => {
    if (group) {
      setName(group.name)
      setDescription(group.description || '')
      setTotalTasksNeeded(group.totalTasksNeeded.toString())
    }
  }, [group])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const tasksNum = parseInt(totalTasksNeeded) || 10

    if (name.trim() && tasksNum > 0) {
      updateGroupSettings(params.id, name.trim(), description.trim(), tasksNum)
      router.push(`/group/${params.id}`)
    }
  }

  if (!currentUserName) {
    return null
  }

  if (!group) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-xl mx-auto">
          <div className="rounded-lg border p-8 shadow-sm bg-white text-center">
            <h1 className="text-xl font-bold mb-2">Group Not Found</h1>
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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link href={`/group/${params.id}`} className="text-blue-600 hover:underline text-sm">
            ← Back to dashboard
          </Link>
        </div>

        <div className="rounded-lg border p-6 shadow-sm bg-white">
          <h1 className="text-2xl font-bold mb-2">Project Settings</h1>
          <p className="text-gray-600 mb-6">Update your project configuration</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Project name"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description..."
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="totalTasks" className="block text-sm font-medium mb-2">
                Total Tasks Needed *
              </label>
              <input
                type="number"
                id="totalTasks"
                value={totalTasksNeeded}
                onChange={(e) => setTotalTasksNeeded(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
                min="1"
                step="1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This sets the project completion goal for the progress bar
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
              <Link
                href={`/group/${params.id}`}
                className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-3 font-medium hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
