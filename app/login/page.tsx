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

  const handleLoadDemo = async () => {
    await loadDemoData()
    router.push('/groups')
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-xl mx-auto w-full">
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4">
          <h1 className="text-3xl font-bold mb-2 text-center text-[#003A79]">Fairmark</h1>
          <p className="text-[#333333] mb-6 text-center">
            Track contributions and ensure fairness in group projects.
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
                className={`w-full px-4 py-2 border rounded-md bg-[#F5F5F5] focus:outline-none focus:ring-2 ${
                  error ? 'border-red-500 focus:ring-red-500' : 'border-[#003A79] focus:ring-[#003A79]'
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
              className="w-full bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition"
            >
              Continue
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-[#333333] mb-3 text-center">
              Or explore with demo data.
            </p>
            <button
              onClick={handleLoadDemo}
              type="button"
              className="w-full bg-[#003A79] text-white font-semibold px-5 py-2 rounded-md hover:bg-[#002d5c] transition mb-3"
            >
              Load Demo Data
            </button>
            <button
              onClick={async () => {
                await loadCanvasMockData()
                router.push('/groups')
              }}
              type="button"
              className="w-full border border-[#003A79] text-[#003A79] px-5 py-2 rounded-md hover:bg-[#003A79] hover:text-white transition"
            >
              Load Data From Canvas
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
