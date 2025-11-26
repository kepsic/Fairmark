'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import GroupCard from '@/components/GroupCard'

export default function JoinGroupPage() {
  const [groupId, setGroupId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { groups, currentUserName, joinGroup } = useGroups()

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  const handleJoinById = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (groupId.trim()) {
      const success = await joinGroup(groupId.trim(), currentUserName!)
      if (success) {
        router.push(`/group/${groupId.trim()}`)
      } else {
        setError('Group not found. Please check the ID and try again.')
      }
    }
  }

  const handleJoinFromList = async (id: string) => {
    await joinGroup(id, currentUserName!)
    router.push(`/group/${id}`)
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

        <h1 className="text-2xl font-bold mb-6 text-[#003A79]">Join a Project</h1>

        {/* Join by ID */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 text-[#003A79]">Join by Project ID</h2>

          <form onSubmit={handleJoinById} className="space-y-4">
            <div>
              <label htmlFor="groupId" className="block text-sm font-medium mb-2">
                Enter Group ID
              </label>
              <input
                type="text"
                id="groupId"
                value={groupId}
                onChange={(e) => {
                  setGroupId(e.target.value)
                  setError('')
                }}
                className="w-full px-4 py-2 border border-[#003A79] rounded-md bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#003A79]"
                placeholder="Paste project ID here"
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition"
            >
              Join Project
            </button>
          </form>
        </div>

        {/* Browse all groups */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-[#003A79]">Or Browse All Projects</h2>
          {groups.length === 0 ? (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4 text-center">
              <p className="text-[#333333]">
                No projects available yet. Create one to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleJoinFromList(group.id)}
                  className="cursor-pointer"
                >
                  <GroupCard group={group} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
