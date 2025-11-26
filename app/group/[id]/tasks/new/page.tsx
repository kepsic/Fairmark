'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import { validation } from '@/lib/validation'

export default function NewTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getGroup, currentUserName, createTask } = useGroups()
  const group = getGroup(params.id)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState('')
  const [errors, setErrors] = useState<{ title?: string; description?: string; hours?: string }>({})

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const titleValidation = validation.groupName(title) // Reuse for task title
    const descValidation = validation.description(description)
    const hoursNum = parseFloat(hours)
    const hoursValidation = validation.hours(hoursNum)

    const newErrors: { title?: string; description?: string; hours?: string } = {}
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error
    }
    if (!descValidation.isValid) {
      newErrors.description = descValidation.error
    }
    if (!hoursValidation.isValid) {
      newErrors.hours = hoursValidation.error
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await createTask(params.id, titleValidation.sanitized, descValidation.sanitized, hoursValidation.value)
    router.push(`/group/${params.id}`)
  }

  if (!currentUserName) {
    return null
  }

  if (!group) {
    return (
      <div className="p-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4 text-center">
            <h1 className="text-xl font-bold mb-2 text-[#003A79]">Project Not Found</h1>
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

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link href={`/group/${params.id}`} className="text-[#005BB5] hover:underline text-sm">
            ← Back to dashboard
          </Link>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4">
          <h1 className="text-2xl font-bold mb-2 text-[#003A79]">Create New Task</h1>
          <p className="text-[#333333] mb-6">{group.name}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setErrors((prev) => ({ ...prev, title: undefined }))
                }}
                className={`w-full px-4 py-2 border rounded-md bg-[#F5F5F5] focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-500 focus:ring-red-500' : 'border-[#003A79] focus:ring-[#003A79]'
                }`}
                placeholder="Design user interface"
                required
                autoFocus
                maxLength={100}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p id="title-error" className="text-red-600 text-sm mt-2" role="alert">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setErrors((prev) => ({ ...prev, description: undefined }))
                }}
                className={`w-full px-4 py-2 border rounded-md bg-[#F5F5F5] focus:outline-none focus:ring-2 ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-[#003A79] focus:ring-[#003A79]'
                }`}
                placeholder="Task details and requirements."
                rows={4}
                maxLength={500}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <p id="description-error" className="text-red-600 text-sm mt-2" role="alert">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium mb-2">
                Estimated Hours *
              </label>
              <input
                type="number"
                id="hours"
                value={hours}
                onChange={(e) => {
                  setHours(e.target.value)
                  setErrors((prev) => ({ ...prev, hours: undefined }))
                }}
                className={`w-full px-4 py-2 border rounded-md bg-[#F5F5F5] focus:outline-none focus:ring-2 ${
                  errors.hours ? 'border-red-500 focus:ring-red-500' : 'border-[#003A79] focus:ring-[#003A79]'
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

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition"
              >
                Create Task
              </button>
              <Link
                href={`/group/${params.id}`}
                className="flex-1 bg-gray-200 text-gray-700 rounded-md px-4 py-3 font-medium hover:bg-gray-300 transition text-center"
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
