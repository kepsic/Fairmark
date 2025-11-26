'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGroups } from '@/context/GroupContext'
import { validation } from '@/lib/validation'

export default function LoginPage() {
  const [firstName, setFirstName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { setCurrentUserName, loadDemoData, loadCanvasMockData } = useGroups()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const validationResult = validation.userName(firstName)
    if (!validationResult.isValid) {
      setError(validationResult.error || 'Invalid name')
      return
    }
    
    setCurrentUserName(validationResult.sanitized)
    router.push('/groups')
  }

  const handleLoadDemo = () => {
    loadDemoData()
    router.push('/groups')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl mx-auto w-full">
        <div className="rounded-lg border p-8 shadow-sm bg-white">
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome to Fairmark</h1>
          <p className="text-gray-600 mb-6 text-center">
            Track contributions and ensure fairness in group projects
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                What&apos;s your first name?
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  setError('')
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Enter your first name"
                required
                autoFocus
                maxLength={50}
                minLength={2}
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
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3 text-center">
              Or explore with demo data
            </p>
            <button
              onClick={handleLoadDemo}
              type="button"
              className="w-full bg-green-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-green-700 transition-colors mb-3"
            >
              🚀 Load Demo (3 Projects, 4 Users)
            </button>
            <button
              onClick={() => {
                loadCanvasMockData()
                router.push('/groups')
              }}
              type="button"
              className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-purple-700 transition-colors"
            >
              📥 Load Data From Canvas (Mock)
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Canvas demo shows SaaS Platform MVP with unbalanced workload (Alice 57%)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
