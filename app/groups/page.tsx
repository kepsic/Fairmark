'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import GroupCard from '@/components/GroupCard'

export default function GroupsPage() {
  const router = useRouter()
  const { groups, currentUserName, loadDemoData, loadCanvasMockData } = useGroups()
  const [isLoadingDemo, setIsLoadingDemo] = useState(false)

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
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-[#003A79] mb-2">
                  No Projects Yet
                </h3>
                <p className="text-[#333333] mb-2">
                  You haven&apos;t joined any projects yet.
                </p>
                <p className="text-sm text-gray-600">
                  Create a new project, join an existing one, or explore with demo data.
                </p>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-[#333333] mb-3 text-center">
                    Explore with demo data
                  </p>
                  <button
                    onClick={async () => {
                      setIsLoadingDemo(true)
                      try {
                        await loadDemoData()
                      } catch (error) {
                        console.error('Error loading demo data:', error)
                        alert('Failed to load demo data. Check console for details.')
                      } finally {
                        setIsLoadingDemo(false)
                      }
                    }}
                    disabled={isLoadingDemo}
                    type="button"
                    className="w-full bg-[#003A79] text-white font-semibold px-5 py-3 rounded-md hover:bg-[#002d5c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingDemo ? 'Loading...' : 'Load Demo Data'}
                  </button>
                  <button
                    onClick={async () => {
                      setIsLoadingDemo(true)
                      try {
                        await loadCanvasMockData()
                      } catch (error) {
                        console.error('Error loading Canvas data:', error)
                        alert('Failed to load Canvas data. Check console for details.')
                      } finally {
                        setIsLoadingDemo(false)
                      }
                    }}
                    disabled={isLoadingDemo}
                    type="button"
                    className="w-full mt-2 border border-[#003A79] text-[#003A79] px-5 py-2 rounded-md hover:bg-[#003A79] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingDemo ? 'Loading...' : 'Load Data From Canvas'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Canvas demo shows SaaS Platform MVP with unbalanced workload
                  </p>
                </div>
              </div>
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
