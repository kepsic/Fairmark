import React from 'react'

type ProgressBarProps = {
  current: number
  total: number
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium" id="progress-label">Progress</span>
        <span className="text-sm font-medium" aria-live="polite">{Math.round(percentage)}%</span>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby="progress-label"
        aria-describedby="progress-description"
      >
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div id="progress-description" className="flex justify-between mt-1 text-xs text-gray-600">
        <span>{current} tasks completed</span>
        <span>{total} tasks needed</span>
      </div>
    </div>
  )
}

export default React.memo(ProgressBar)
