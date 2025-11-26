import React, { useState } from 'react'
import Link from 'next/link'
import { Group } from '@/context/GroupContext'

type GroupCardProps = {
  group: Group
}

function GroupCard({ group }: GroupCardProps) {
  const [showCopied, setShowCopied] = useState(false)
  
  const totalLoggedTasks = group.members.reduce((sum, m) => sum + m.tasks, 0)
  const progress = group.totalTasksNeeded > 0
    ? Math.min((totalLoggedTasks / group.totalTasksNeeded) * 100, 100)
    : 0

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.origin}/group/${group.id}`
    navigator.clipboard.writeText(url).then(() => {
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    })
  }

  return (
    <Link href={`/group/${group.id}`}>
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4 hover:shadow-md transition-shadow cursor-pointer relative">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold flex-1">{group.name}</h3>
          <button
            onClick={handleCopyLink}
            className="ml-2 p-1.5 text-gray-500 hover:text-[#005BB5] hover:bg-gray-100 rounded transition-colors"
            title="Copy shareable link"
          >
            {showCopied ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        </div>
        {showCopied && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Link copied!
          </div>
        )}
        {group.description && (
          <p className="text-sm text-gray-600 mb-3">{group.description}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {group.members.length} member{group.members.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[#005BB5] font-medium">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
          <div
            className="bg-[#005BB5] h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  )
}

export default React.memo(GroupCard)
