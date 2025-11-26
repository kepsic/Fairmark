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
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1 text-[#003A79]">Hi {currentUserName}</h1>
          <p className="text-[#333333]">Manage your group projects.</p>
        </div>

        <div className="space-y-4 mb-6">
          <Link
            href="/groups/new"
            className="block w-full bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition text-center"
          >
            Create New Project
          </Link>
          
          <Link
            href="/groups/join"
            className="block w-full border border-[#003A79] text-[#003A79] px-5 py-2 rounded-md hover:bg-[#003A79] hover:text-white transition text-center font-semibold"
          >
            Join Existing Project
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#003A79]">Your Projects</h2>
          {groups.length === 0 ? (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4 text-center">
              <p className="text-[#333333] mb-4">
                You have not joined any projects yet.
              </p>
              <p className="text-sm text-gray-600">
                Create a new project or join an existing one to get started.
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
