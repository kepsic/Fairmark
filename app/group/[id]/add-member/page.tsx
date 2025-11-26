'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'

export default function AddMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getGroup, currentUserName, addMember } = useGroups()
  const group = getGroup(params.id)

  const [memberName, setMemberName] = useState('')

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (memberName.trim()) {
      addMember(params.id, memberName.trim())
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
          <h1 className="text-2xl font-bold mb-2">Add Team Member</h1>
          <p className="text-gray-600 mb-6">{group.name}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="memberName" className="block text-sm font-medium mb-2">
                Member Name *
              </label>
              <input
                type="text"
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter member's name"
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors"
              >
                Add Member
              </button>
              <Link
                href={`/group/${params.id}`}
                className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-3 font-medium hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Current Members List */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Current Members ({group.members.length})</h3>
            <ul className="space-y-2">
              {group.members.map((member) => (
                <li key={member.id} className="text-sm text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  {member.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
