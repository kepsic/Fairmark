'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import { validation } from '@/lib/validation'

export default function ContributePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getGroup, currentUserName, updateMemberContribution } = useGroups()
  const group = getGroup(params.id)

  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [hours, setHours] = useState('')
  const [tasks, setTasks] = useState('')
  const [errors, setErrors] = useState<{ hours?: string; tasks?: string }>({})

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  useEffect(() => {
    if (group && group.members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(group.members[0].id)
    }
  }, [group, selectedMemberId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    const hoursNum = parseFloat(hours)
    const tasksNum = parseInt(tasks)
    
    const hoursValidation = validation.hours(hoursNum)
    const tasksValidation = validation.tasks(tasksNum)
    
    const newErrors: { hours?: string; tasks?: string } = {}
    if (!hoursValidation.isValid) {
      newErrors.hours = hoursValidation.error
    }
    if (!tasksValidation.isValid) {
      newErrors.tasks = tasksValidation.error
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (selectedMemberId) {
      updateMemberContribution(
        params.id,
        selectedMemberId,
        hoursValidation.value,
        tasksValidation.value
      )
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
          <h1 className="text-2xl font-bold mb-2">Log Contribution</h1>
          <p className="text-gray-600 mb-6">{group.name}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="member" className="block text-sm font-medium mb-2">
                Select Member *
              </label>
              <select
                id="member"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {group.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium mb-2">
                Hours Worked *
              </label>
              <input
                type="number"
                id="hours"
                value={hours}
                onChange={(e) => {
                  setHours(e.target.value)
                  setErrors((prev) => ({ ...prev, hours: undefined }))
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.hours ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="0"
                min="0"
                max="1000"
                step="0.5"
                required
                aria-invalid={!!errors.hours}
                aria-describedby={errors.hours ? 'hours-error' : undefined}
              />
              {errors.hours && (
                <p id="hours-error" className="text-red-600 text-sm mt-2" role="alert">
                  {errors.hours}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="tasks" className="block text-sm font-medium mb-2">
                Tasks Completed *
              </label>
              <input
                type="number"
                id="tasks"
                value={tasks}
                onChange={(e) => {
                  setTasks(e.target.value)
                  setErrors((prev) => ({ ...prev, tasks: undefined }))
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.tasks ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="0"
                min="0"
                max="10000"
                step="1"
                required
                aria-invalid={!!errors.tasks}
                aria-describedby={errors.tasks ? 'tasks-error' : undefined}
              />
              {errors.tasks && (
                <p id="tasks-error" className="text-red-600 text-sm mt-2" role="alert">
                  {errors.tasks}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors"
              >
                Save Contribution
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
