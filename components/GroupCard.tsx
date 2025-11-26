import React from 'react'
import Link from 'next/link'
import { Group } from '@/context/GroupContext'

type GroupCardProps = {
  group: Group
}

function GroupCard({ group }: GroupCardProps) {
  const totalLoggedTasks = group.members.reduce((sum, m) => sum + m.tasks, 0)
  const progress = group.totalTasksNeeded > 0 
    ? Math.min((totalLoggedTasks / group.totalTasksNeeded) * 100, 100) 
    : 0

  return (
    <Link href={`/group/${group.id}`}>
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4 hover:shadow-md transition-shadow cursor-pointer">
        <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
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
