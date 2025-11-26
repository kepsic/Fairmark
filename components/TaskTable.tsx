import React from 'react'
import Link from 'next/link'
import { Task } from '@/context/GroupContext'

type TaskTableProps = {
  tasks: Task[]
  groupId: string
  members: Array<{ id: string; name: string; role?: 'member' | 'sherpa' }>
}

function TaskTable({ tasks, groupId, members }: TaskTableProps) {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left" aria-label="Project tasks">
        <caption className="sr-only">
          Project tasks with status, assigned member, and hours
        </caption>
        <thead className="text-xs uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-3">Task</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Assigned To</th>
            <th scope="col" className="px-4 py-3 text-right">Hours</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const assignedMember = task.assignedTo 
              ? members.find(m => m.id === task.assignedTo)
              : null

            return (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <th scope="row" className="px-4 py-3">
                  <Link 
                    href={`/group/${groupId}/tasks/${task.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {task.title}
                  </Link>
                </th>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {assignedMember ? (
                    <span>
                      {assignedMember.name}
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
