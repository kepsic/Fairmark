'use client'

import { useState } from 'react'
import type { CheckIn } from '@/context/GroupContext'

type WeeklyCheckInFormProps = {
  memberName: string
  memberId: string
  onSubmit: (checkIn: Omit<CheckIn, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

function getISOWeek(date: Date): string {
  const year = date.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}

export default function WeeklyCheckInForm({
  memberName,
  memberId,
  onSubmit,
  onCancel,
}: WeeklyCheckInFormProps) {
  const [whatDidIDo, setWhatDidIDo] = useState('')
  const [whatBlockedMe, setWhatBlockedMe] = useState('')
  const [whatWillIDoNext, setWhatWillIDoNext] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!whatDidIDo.trim() || !whatWillIDoNext.trim()) {
      alert('Please answer at least "What did I do?" and "What will I do next?"')
      return
    }

    setIsSubmitting(true)

    const weekOf = getISOWeek(new Date())

    onSubmit({
      memberId,
      memberName,
      weekOf,
      whatDidIDo: whatDidIDo.trim(),
      whatBlockedMe: whatBlockedMe.trim() || 'Nothing',
      whatWillIDoNext: whatWillIDoNext.trim(),
    })

    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Weekly Check-In</h2>
          <p className="text-sm text-gray-600 mt-1">
            Share your progress for this week - it helps the team stay aligned!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question 1 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              1. What did I accomplish this week? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={whatDidIDo}
              onChange={(e) => setWhatDidIDo(e.target.value)}
              placeholder="List your completed tasks, contributions, or achievements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Examples: &quot;Completed user research&quot;, &quot;Fixed 3 bugs&quot;, &quot;Drafted project proposal&quot;
            </p>
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              2. What blocked or slowed me down?
            </label>
            <textarea
              value={whatBlockedMe}
              onChange={(e) => setWhatBlockedMe(e.target.value)}
              placeholder="Any challenges, blockers, or things that slowed your progress..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank if nothing blocked you. This helps teammates offer support!
            </p>
          </div>

          {/* Question 3 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              3. What will I focus on next week? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={whatWillIDoNext}
              onChange={(e) => setWhatWillIDoNext(e.target.value)}
              placeholder="Your plans and commitments for the upcoming week..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific so teammates know what to expect and can coordinate with you.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Check-In'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
