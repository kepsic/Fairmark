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

  const handleJoinById = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (groupId.trim()) {
      const success = joinGroup(groupId.trim(), currentUserName!)
      if (success) {
        router.push(`/group/${groupId.trim()}`)
      } else {
        setError('Group not found. Please check the ID and try again.')
      }
    }
  }

  const handleJoinFromList = (id: string) => {
    joinGroup(id, currentUserName!)
    router.push(`/group/${id}`)
  }

  if (!currentUserName) {
    return null
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link href="/groups" className="text-blue-600 hover:underline text-sm">
            ← Back to groups
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Join a Group</h1>

        {/* Join by ID */}
        <div className="rounded-lg border p-6 shadow-sm bg-white mb-6">
          <h2 className="text-lg font-semibold mb-4">Join by Group ID</h2>
          
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste group ID here"
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Join Group
            </button>
          </form>
        </div>

        {/* Browse all groups */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Or Browse All Groups</h2>
          {groups.length === 0 ? (
            <div className="rounded-lg border p-8 shadow-sm bg-white text-center">
              <p className="text-gray-500">
                No groups available yet. Create one to get started!
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
