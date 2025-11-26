import React from 'react'
import Link from 'next/link'
import { Task, Member } from '@/context/GroupContext'

type TaskModalProps = {
  task: Task
  members: Member[]
  groupId: string
  currentUserName?: string
  onClose: () => void
}

function TaskModal({ task, members, groupId, currentUserName, onClose }: TaskModalProps) {
  const assignedMember = task.assignedTo
    ? members.find(m => m.id === task.assignedTo)
    : null

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800 border-gray-300',
    'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'done': 'bg-green-100 text-green-800 border-green-300'
  }

  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-[#003A79] mb-2">{task.title}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-md text-sm font-semibold border ${statusColors[task.status]}`}>
                {statusLabels[task.status]}
              </span>
              <span className="text-sm text-gray-600">
                <span className="font-medium">{task.hours}h</span> estimated
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Assignment */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Assigned To</h3>
            {assignedMember ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#003A79] text-white flex items-center justify-center font-semibold text-sm">
                  {assignedMember.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {assignedMember.name}
                    {currentUserName === assignedMember.name && (
                      <span className="ml-2 text-xs text-blue-600">(You)</span>
                    )}
                  </div>
                  {assignedMember.role === 'sherpa' && (
                    <span className="text-xs text-purple-600">Sherpa</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic">Unassigned</p>
            )}
          </div>

          {/* Work Logs */}
          {task.workLogs && task.workLogs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Work Log ({task.workLogs.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[...task.workLogs]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 3)
                  .map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">{log.author}</span>
                        <div className="flex items-center gap-2">
                          {log.hoursSpent !== undefined && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {log.hoursSpent}h
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{log.content}</p>
                    </div>
                  ))}
              </div>
              {task.workLogs.length > 3 && (
                <p className="text-xs text-gray-500 mt-2">
                  Showing 3 of {task.workLogs.length} logs
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            Close
          </button>
          <Link
            href={`/group/${groupId}/tasks/${task.id}`}
            className="px-4 py-2 bg-[#005BB5] text-white rounded-md hover:bg-[#004a99] transition-colors font-medium"
          >
            View Full Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
