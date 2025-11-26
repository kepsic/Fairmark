'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getAllUsers, createUser } from '@/lib/firebase/operations'
import type { UserDoc } from '@/lib/firebase/types'
import { validation } from '@/lib/validation'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<UserDoc[]>([])
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUserName')
    if (currentUser) {
      router.replace('/groups')
    } else {
      router.replace('/login')
    }
  }, [router])

  const loadUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectUser = (userName: string) => {
    localStorage.setItem('currentUserName', userName)
    router.push('/groups')
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationResult = validation.userName(newUserName)
    if (!validationResult.isValid) {
      setError(validationResult.error || 'Invalid name')
      return
    }

    setIsCreating(true)
    try {
      const user = await createUser(validationResult.sanitized)
      localStorage.setItem('currentUserName', user.name)
      router.push('/groups')
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user. Please try again.')
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading..." />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4">
          <h1 className="text-3xl font-bold mb-2 text-center text-[#003A79]">Fairmark</h1>
          <p className="text-[#333333] mb-8 text-center">
            Track contributions and ensure fairness in group projects.
          </p>

          {!showNewUserForm ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#003A79]">Select User</h2>
              
              {users.length > 0 ? (
                <div className="space-y-2 mb-6">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user.name)}
                      className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-[#F5F5F5] hover:border-[#003A79] transition flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-medium text-[#003A79]">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <svg 
                        className="w-5 h-5 text-gray-400 group-hover:text-[#003A79] transition" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 mb-6">No users yet. Create your first user!</p>
              )}

              <button
                onClick={() => setShowNewUserForm(true)}
                className="w-full bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition"
              >
                Create New User
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#003A79]">Create New User</h2>
                <button
                  onClick={() => {
                    setShowNewUserForm(false)
                    setNewUserName('')
                    setError('')
                  }}
                  className="text-sm text-gray-600 hover:text-[#003A79] transition"
                >
                  ← Back to users
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium mb-2">
                    What&apos;s your name?
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={newUserName}
                    onChange={(e) => {
                      setNewUserName(e.target.value)
                      setError('')
                    }}
                    className={`w-full px-4 py-2 border rounded-md bg-[#F5F5F5] focus:outline-none focus:ring-2 ${
                      error ? 'border-red-500 focus:ring-red-500' : 'border-[#003A79] focus:ring-[#003A79]'
                    }`}
                    placeholder="Enter your name"
                    required
                    autoFocus
                    maxLength={50}
                    minLength={2}
                    disabled={isCreating}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'name-error' : undefined}
                  />
                  {error && (
                    <p id="name-error" className="text-red-600 text-sm mt-2" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
