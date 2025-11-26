'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import { validation } from '@/lib/validation'

export default function NewGroupPage() {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})
  const router = useRouter()
  const { currentUserName, createGroup } = useGroups()

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const nameValidation = validation.groupName(groupName)
    const descValidation = validation.description(description)

    const newErrors: { name?: string; description?: string } = {}
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error
    }
    if (!descValidation.isValid) {
      newErrors.description = descValidation.error
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const groupId = await createGroup(
      nameValidation.sanitized,
      descValidation.sanitized || undefined
    )
    router.push(`/group/${groupId}`)
  }

  if (!currentUserName) {
    return null
  }

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link href="/groups" className="text-[#005BB5] hover:underline text-sm">
            ← Back to projects
          </Link>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4">
          <h1 className="text-2xl font-bold mb-6 text-[#003A79]">Create New Project</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium mb-2">
                Group / Project Name *
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value)
                  setErrors((prev) => ({ ...prev, name: undefined }))
                }}
                className={`w-full px-4 py-2 border rounded-md bg-[#F5F5F5] focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#003A79] focus:ring-[#003A79]'
                }`}
                placeholder="Software Engineering Project"
                required
                autoFocus
                maxLength={100}
                minLength={3}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-red-600 text-sm mt-2" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description (Optional)
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
                placeholder="Brief description of the project."
                rows={3}
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

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition"
              >
                Create Project
              </button>
              <Link
                href="/groups"
                className="flex-1 bg-gray-200 text-gray-700 rounded-md px-4 py-3 font-medium hover:bg-gray-300 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            You will be automatically added as the first member of this project.
          </p>
        </div>
      </div>
    </div>
  )
}
