'use client'

import { useState } from 'react'
import type { Member, PeerReview } from '@/context/GroupContext'

type PeerReviewFormProps = {
  members: Member[]
  currentMemberId: string
  onSubmit: (reviews: Omit<PeerReview, 'id' | 'createdAt'>[]) => void
  onCancel: () => void
}

function getISOWeek(date: Date): string {
  const year = date.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}

export default function PeerReviewForm({
  members,
  currentMemberId,
  onSubmit,
  onCancel,
}: PeerReviewFormProps) {
  const reviewableMembers = members.filter(m => m.id !== currentMemberId)
  
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingChange = (memberId: string, score: number) => {
    setRatings(prev => ({ ...prev, [memberId]: score }))
  }

  const handleCommentChange = (memberId: string, comment: string) => {
    setComments(prev => ({ ...prev, [memberId]: comment }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if all members are rated
    const allRated = reviewableMembers.every(m => ratings[m.id] !== undefined)
    if (!allRated) {
      alert('Please rate all team members before submitting')
      return
    }

    setIsSubmitting(true)

    const weekOf = getISOWeek(new Date())

    const reviews: Omit<PeerReview, 'id' | 'createdAt'>[] = reviewableMembers.map(member => ({
      reviewerId: currentMemberId,
      reviewedMemberId: member.id,
      score: ratings[member.id],
      comment: comments[member.id]?.trim() || undefined,
      weekOf,
    }))

    onSubmit(reviews)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Peer Contribution Review</h2>
          <p className="text-sm text-gray-600 mt-1">
            Rate your teammates&apos; contributions this week (1-5 scale). Your responses are anonymous.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900 font-medium mb-2">💡 Rating Guide</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>⭐ 1 - No visible contribution</li>
              <li>⭐⭐ 2 - Minimal contribution</li>
              <li>⭐⭐⭐ 3 - Adequate contribution (meeting expectations)</li>
              <li>⭐⭐⭐⭐ 4 - Strong contribution (exceeding expectations)</li>
              <li>⭐⭐⭐⭐⭐ 5 - Exceptional contribution</li>
            </ul>
          </div>

          {reviewableMembers.map(member => (
            <div
              key={member.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">
                    {member.tasks} tasks • {member.hours}h
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate their contribution <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleRatingChange(member.id, score)}
                      className={`flex-1 py-2 px-3 rounded border-2 transition-all font-medium text-sm ${
                        ratings[member.id] === score
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {score}⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional comment (anonymous)
                </label>
                <textarea
                  value={comments[member.id] || ''}
                  onChange={(e) => handleCommentChange(member.id, e.target.value)}
                  placeholder="Share specific feedback or appreciation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={2}
                />
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Reviews'}
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
