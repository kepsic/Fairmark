import React from 'react'
import { Member, Task } from '@/context/GroupContext'
import { calculateTaskFairness } from '@/lib/fairness'

type FairnessBadgeProps = {
  members: Member[]
  tasks?: Task[]
}

function FairnessBadge({ members, tasks = [] }: FairnessBadgeProps) {
  const { fairnessStatus } = calculateTaskFairness(members, tasks)

  let message = 'Balanced'
  let colorClass = 'bg-green-100 text-green-800 border-green-300'

  if (fairnessStatus === 'unbalanced') {
    message = 'Unbalanced'
    colorClass = 'bg-red-100 text-red-800 border-red-300'
  } else if (fairnessStatus === 'slightly-unbalanced') {
    message = 'Slightly Unbalanced'
    colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }

  return (
    <div
      className={`inline-block px-4 py-2 rounded-lg border-2 font-semibold ${colorClass}`}
      role="status"
      aria-label={`Team fairness status: ${message}`}
    >
      {message}
    </div>
  )
}

export default React.memo(FairnessBadge)
