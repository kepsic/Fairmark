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
  let colorClass = 'bg-green-600 text-white'

  if (fairnessStatus === 'unbalanced') {
    message = 'Unbalanced'
    colorClass = 'bg-red-600 text-white'
  } else if (fairnessStatus === 'slightly-unbalanced') {
    message = 'Slightly Unbalanced'
    colorClass = 'bg-yellow-500 text-black'
  }

  return (
    <div
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}
      role="status"
      aria-label={`Team fairness status: ${message}`}
    >
      {message}
    </div>
  )
}

export default React.memo(FairnessBadge)
