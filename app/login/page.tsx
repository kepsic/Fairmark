'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGroups } from '@/context/GroupContext'
import { validation } from '@/lib/validation'
import { getAllUsers, createUser } from '@/lib/firebase/operations'
import type { UserDoc } from '@/lib/firebase/types'

export default function LoginPage() {
  const [firstName, setFirstName] = useState('')
  const [error, setError] = useState('')
  const [users, setUsers] = useState<UserDoc[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { setCurrentUserName } = useGroups()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleSelectUser = (userName: string) => {
    setCurrentUserName(userName)
    router.push('/groups')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationResult = validation.userName(firstName)
    if (!validationResult.isValid) {
      setError(validationResult.error || 'Invalid name')
      return
    }

    setIsCreating(true)
    try {
      const user = await createUser(validationResult.sanitized)
      setCurrentUserName(user.name)
      router.push('/groups')
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user. Please try again.')
      setIsCreating(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-xl mx-auto w-full">
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4">
          <h1 className="text-3xl font-bold mb-2 text-center text-[#003A79]">Fairmark</h1>
          <p className="text-[#333333] mb-6 text-center">
            Track contributions and ensure fairness in group projects.
          </p>

          {!showNewUserForm && users.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-[#003A79]">Select Existing User</h2>
              <div className="space-y-2">
                {users.slice(0, 5).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.name)}
                    className="w-full text-left px-4 py-2 border border-gray-200 rounded-md hover:bg-[#F5F5F5] hover:border-[#003A79] transition flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-medium text-[#003A79]">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <svg 
                      className="w-4 h-4 text-gray-400 group-hover:text-[#003A79] transition" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
              {!showNewUserForm && (
                <button
                  onClick={() => setShowNewUserForm(true)}
                  className="w-full mt-3 text-sm text-[#003A79] hover:underline"
                >
                  Or create a new user →
                </button>
              )}
            </div>
          )}

          {(showNewUserForm || users.length === 0) && (
            <>
              {users.length > 0 && (
                <button
                  onClick={() => setShowNewUserForm(false)}
                  className="text-sm text-gray-600 hover:text-[#003A79] transition mb-4"
                >
                  ← Back to user list
                </button>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    {users.length === 0 ? "What's your first name?" : "Create New User"}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      setError('')
                    }}
                    className={`w-full px-4 py-2 border rounded-md bg-[#F5F5F5] focus:outline-none focus:ring-2 ${
                      error ? 'border-red-500 focus:ring-red-500' : 'border-[#003A79] focus:ring-[#003A79]'
                    }`}
                    placeholder="Enter your first name"
                    required
                    autoFocus={showNewUserForm || users.length === 0}
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
                  {isCreating ? 'Creating...' : 'Continue'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
