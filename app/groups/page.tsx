'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import GroupCard from '@/components/GroupCard'

export default function GroupsPage() {
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
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Hi {currentUserName}!</h1>
          <p className="text-gray-600">Manage your group projects</p>
        </div>

        <div className="space-y-4 mb-6">
          <Link
            href="/groups/new"
            className="block w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-center font-medium hover:bg-blue-700 transition-colors"
          >
            Create New Group
          </Link>
          
          <Link
            href="/groups/join"
            className="block w-full bg-white border-2 border-blue-600 text-blue-600 rounded-lg px-4 py-3 text-center font-medium hover:bg-blue-50 transition-colors"
          >
            Join Existing Group
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
          {groups.length === 0 ? (
            <div className="rounded-lg border p-8 shadow-sm bg-white text-center">
              <p className="text-gray-500 mb-4">
                You haven&apos;t joined any groups yet.
              </p>
              <p className="text-sm text-gray-400">
                Create a new group or join an existing one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
