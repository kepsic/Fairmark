import React from 'react'
import Link from 'next/link'
import { Task } from '@/context/GroupContext'

type SortField = 'title' | 'status' | 'assignedTo' | 'hours'
type SortOrder = 'asc' | 'desc'

type TaskTableProps = {
  tasks: Task[]
  groupId: string
  members: Array<{ id: string; name: string; role?: 'member' | 'sherpa' }>
  currentUserName?: string
  sortField?: SortField
  sortOrder?: SortOrder
  onSort?: (field: SortField) => void
}

function TaskTable({ tasks, groupId, members, currentUserName, sortField, sortOrder, onSort }: TaskTableProps) {
  const statusColors = {
    'todo': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    'done': 'bg-green-100 text-green-700'
  }

  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks yet. Create your first task to get started!
      </div>
    )
  }

  const SortableHeader = ({ field, label, align = 'left' }: { field: SortField; label: string; align?: 'left' | 'right' }) => {
    const isActive = sortField === field
    const alignClass = align === 'right' ? 'justify-end' : 'justify-start'
    
    return (
      <th 
        scope="col" 
        className={`px-4 py-3 ${onSort ? 'cursor-pointer select-none hover:bg-[#004a8f]' : ''}`}
        onClick={() => onSort?.(field)}
      >
        <div className={`flex items-center gap-1 ${alignClass}`}>
          <span>{label}</span>
          {isActive && (
            <span className="text-white">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </th>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left" aria-label="Project tasks">
        <caption className="sr-only">
          Project tasks with status, assigned member, and hours
        </caption>
        <thead className="text-xs uppercase bg-[#003A79] text-white">
          <tr>
            <SortableHeader field="title" label="Task" />
            <SortableHeader field="status" label="Status" />
            <SortableHeader field="assignedTo" label="Assigned To" />
            <SortableHeader field="hours" label="Hours" align="right" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const assignedMember = task.assignedTo
              ? members.find(m => m.id === task.assignedTo)
              : null

            const isMyTask = currentUserName && assignedMember && assignedMember.name === currentUserName

            return (
              <tr 
                key={task.id} 
                className={`border-b border-gray-300 ${
                  isMyTask 
                    ? 'bg-blue-50 hover:bg-blue-100' 
                    : 'odd:bg-white even:bg-[#F5F5F5] hover:bg-gray-100'
                } transition-colors`}
              >
                <th scope="row" className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isMyTask && (
                      <span className="text-blue-600 font-bold" title="Your task">
                        →
                      </span>
                    )}
                    <Link
                      href={`/group/${groupId}/tasks/${task.id}`}
                      className={`font-medium hover:underline ${
                        isMyTask ? 'text-blue-700' : 'text-[#005BB5]'
                      }`}
                    >
                      {task.title}
                    </Link>
                  </div>
                </th>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {assignedMember ? (
                    <span className={isMyTask ? 'font-semibold text-blue-700' : ''}>
                      {assignedMember.name}
                      {isMyTask && (
                        <span className="ml-1 text-xs text-blue-600">(You)</span>
                      )}
                      {assignedMember.role === 'sherpa' && (
                        <span className="ml-1 text-xs text-purple-600">●</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {task.hours}h
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default React.memo(TaskTable)
