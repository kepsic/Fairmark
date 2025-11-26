'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups, TaskStatus } from '@/context/GroupContext'
import { addWorkLog } from '@/lib/firebase/operations'

export default function TaskDetailPage({ params }: { params: { id: string; taskId: string } }) {
  const router = useRouter()
  const { getGroup, getTask, currentUserName, assignTask, updateTaskStatus, deleteTask } = useGroups()
  const group = getGroup(params.id)
  const task = getTask(params.id, params.taskId)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newLogContent, setNewLogContent] = useState('')
  const [newLogHours, setNewLogHours] = useState('')
  const [isAddingLog, setIsAddingLog] = useState(false)

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  const handleAssign = async (memberId: string | null) => {
    await assignTask(params.id, params.taskId, memberId)
  }

  const handleStatusChange = async (status: TaskStatus) => {
    await updateTaskStatus(params.id, params.taskId, status)
  }

  const handleDelete = async () => {
    await deleteTask(params.id, params.taskId)
    router.push(`/group/${params.id}`)
  }

  const handleAddWorkLog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLogContent.trim() || !currentUserName) return

    setIsAddingLog(true)
    try {
      const hours = newLogHours ? parseFloat(newLogHours) : undefined
      await addWorkLog(params.taskId, currentUserName, newLogContent.trim(), hours)
      setNewLogContent('')
      setNewLogHours('')
      // Reload the page to show the new log
      window.location.reload()
    } catch (error) {
      console.error('Error adding work log:', error)
      alert('Failed to add work log')
    } finally {
      setIsAddingLog(false)
    }
  }

  if (!currentUserName) {
    return null
  }

  if (!group || !task) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-xl mx-auto">
          <div className="rounded-lg border p-8 shadow-sm bg-white text-center">
            <h1 className="text-xl font-bold mb-2">Task Not Found</h1>
            <Link
              href={`/group/${params.id}`}
              className="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const assignedMember = task.assignedTo
    ? group.members.find(m => m.id === task.assignedTo)
    : null

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800 border-gray-300',
    'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'done': 'bg-green-100 text-green-800 border-green-300'
  }

  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link href={`/group/${params.id}`} className="text-blue-600 hover:underline text-sm">
            ← Back to dashboard
          </Link>
        </div>

        <div className="rounded-lg border p-6 shadow-sm bg-white mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold flex-1">{task.title}</h1>
            <div className={`px-3 py-1 rounded-lg border-2 text-sm font-semibold ${statusColors[task.status]}`}>
              {statusLabels[task.status]}
            </div>
          </div>

          {task.description && (
            <p className="text-gray-700 mb-4">{task.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Estimated Hours</p>
              <p className="text-lg font-semibold">{task.hours}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned To</p>
              <p className="text-lg font-semibold">
                {assignedMember ? (
                  <span>
                    {assignedMember.name}
                    {assignedMember.role === 'sherpa' && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Sherpa
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}
              </p>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Assign Task</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleAssign(null)}
                className={`w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                  !task.assignedTo ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <span className="font-medium">Unassigned</span>
              </button>
              {group.members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleAssign(member.id)}
                  className={`w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                    task.assignedTo === member.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <span className="font-medium">{member.name}</span>
                  {member.role === 'sherpa' && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Sherpa
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Update Status</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('todo')}
                className={`flex-1 px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                  task.status === 'todo'
                    ? 'border-gray-500 bg-gray-100 text-gray-800'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => handleStatusChange('in-progress')}
                className={`flex-1 px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                  task.status === 'in-progress'
                    ? 'border-yellow-500 bg-yellow-100 text-yellow-800'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange('done')}
                className={`flex-1 px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                  task.status === 'done'
                    ? 'border-green-500 bg-green-100 text-green-800'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          {/* Work Log Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Work Log</h2>
            
            {/* Add Work Log Form */}
            <form onSubmit={handleAddWorkLog} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <textarea
                value={newLogContent}
                onChange={(e) => setNewLogContent(e.target.value)}
                placeholder="What did you work on? Any blockers? Implementation details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isAddingLog}
              />
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label htmlFor="hours" className="block text-sm text-gray-600 mb-1">
                    Hours Spent (optional)
                  </label>
                  <input
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0"
                    value={newLogHours}
                    onChange={(e) => setNewLogHours(e.target.value)}
                    placeholder="2.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isAddingLog}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAddingLog || !newLogContent.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingLog ? 'Adding...' : 'Add Log'}
                </button>
              </div>
            </form>

            {/* Work Log Entries */}
            <div className="space-y-3">
              {task.workLogs && task.workLogs.length > 0 ? (
                [...task.workLogs]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{log.author}</span>
                          {log.hoursSpent !== undefined && (
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {log.hoursSpent}h
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(log.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{log.content}</p>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No work logs yet. Add your first log above!</p>
                </div>
              )}
            </div>
          </div>

          {/* Delete Section */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-50 text-red-600 border border-red-300 rounded-lg px-4 py-2 font-medium hover:bg-red-100 transition-colors"
            >
              Delete Task
            </button>
          ) : (
            <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
              <p className="text-red-800 font-medium mb-3">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
