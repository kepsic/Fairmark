import React, { useMemo } from 'react'
import { Task, Member } from '@/context/GroupContext'

type GanttChartProps = {
  tasks: Task[]
  members: Member[]
  onTaskClick?: (taskId: string) => void
}

function GanttChart({ tasks, members, onTaskClick }: GanttChartProps) {
  const statusColors = {
    'todo': '#9CA3AF',
    'in-progress': '#F59E0B',
    'done': '#10B981'
  }

  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  }

  // Calculate critical path - tasks with highest hours per assignee
  const criticalPathData = useMemo(() => {
    if (tasks.length === 0) return { criticalTaskIds: new Set<string>(), criticalHours: 0 }

    // Group tasks by assignee
    const tasksByAssignee = tasks.reduce((acc, task) => {
      const assignee = task.assignedTo || 'unassigned'
      if (!acc[assignee]) acc[assignee] = []
      acc[assignee].push(task)
      return acc
    }, {} as Record<string, Task[]>)

    // Calculate total hours per assignee
    const assigneeHours = Object.entries(tasksByAssignee).map(([assignee, assigneeTasks]) => ({
      assignee,
      totalHours: assigneeTasks.reduce((sum, t) => sum + t.hours, 0),
      tasks: assigneeTasks
    }))

    // Critical path is the assignee with most hours (bottleneck)
    const criticalAssignee = assigneeHours.reduce((max, current) => 
      current.totalHours > max.totalHours ? current : max
    , assigneeHours[0])

    // Mark tasks on critical path
    const criticalTaskIds = new Set(criticalAssignee.tasks.map(t => t.id))
    
    // Also include longest individual tasks (top 20% by hours)
    const sortedByHours = [...tasks].sort((a, b) => b.hours - a.hours)
    const threshold = Math.ceil(tasks.length * 0.2)
    sortedByHours.slice(0, threshold).forEach(t => criticalTaskIds.add(t.id))

    return {
      criticalTaskIds,
      criticalHours: criticalAssignee.totalHours,
      criticalAssignee: members.find(m => m.id === criticalAssignee.assignee)?.name || 'Unassigned'
    }
  }, [tasks, members])

  // Calculate timeline based on tasks
  const timelineData = useMemo(() => {
    if (tasks.length === 0) return null

    // Sort tasks by status priority and then by title
    const sortedTasks = [...tasks].sort((a, b) => {
      const statusOrder = { 'done': 0, 'in-progress': 1, 'todo': 2 }
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status]
      }
      return a.title.localeCompare(b.title)
    })

    // Calculate total hours and position for each task
    const totalHours = sortedTasks.reduce((sum, task) => sum + task.hours, 0)
    let cumulativeHours = 0

    const tasksWithPosition = sortedTasks.map(task => {
      const startPercent = totalHours > 0 ? (cumulativeHours / totalHours) * 100 : 0
      const widthPercent = totalHours > 0 ? (task.hours / totalHours) * 100 : 0
      cumulativeHours += task.hours

      return {
        ...task,
        startPercent,
        widthPercent,
        isCritical: criticalPathData.criticalTaskIds.has(task.id)
      }
    })

    return {
      tasks: tasksWithPosition,
      totalHours
    }
  }, [tasks, criticalPathData])

  if (!timelineData || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks to display in timeline view.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Critical Path Alert */}
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Critical Path Detected</h4>
              <p className="text-xs text-red-700">
                <strong>{criticalPathData.criticalAssignee}</strong> has the highest workload ({criticalPathData.criticalHours}h). 
                Tasks on the critical path are highlighted with red borders and determine minimum project duration.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Project Timeline</h3>
            <div className="text-sm text-gray-600">
              Total: {timelineData.totalHours} hours
            </div>
          </div>
          
          {/* Hour markers */}
          <div className="relative h-6 border-b border-gray-300">
            <div className="absolute inset-0 flex">
              {[0, 25, 50, 75, 100].map(percent => (
                <div
                  key={percent}
                  className="absolute text-xs text-gray-500"
                  style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
                >
                  {Math.round((percent / 100) * timelineData.totalHours)}h
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gantt Bars */}
        <div className="space-y-2">
          {timelineData.tasks.map(task => {
            const assignedMember = task.assignedTo
              ? members.find(m => m.id === task.assignedTo)
              : null

            return (
              <div key={task.id} className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-48 flex-shrink-0">
                    <div className="text-sm font-medium text-gray-900 truncate" title={task.title}>
                      {task.title}
                    </div>
                    {assignedMember && (
                      <div className="text-xs text-gray-500 truncate">
                        {assignedMember.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 relative h-10 bg-gray-100 rounded-md overflow-hidden">
                    {/* Task bar */}
                    <div
                      className={`absolute h-full rounded-md transition-all duration-300 group-hover:opacity-90 cursor-pointer flex items-center px-3 ${
                        task.isCritical ? 'ring-2 ring-red-500 ring-offset-1' : ''
                      }`}
                      style={{
                        left: `${task.startPercent}%`,
                        width: `${task.widthPercent}%`,
                        backgroundColor: statusColors[task.status],
                        minWidth: '60px'
                      }}
                      title={`${task.title} - ${task.hours}h - ${statusLabels[task.status]}${task.isCritical ? ' (Critical Path)' : ''}`}
                      onClick={() => onTaskClick?.(task.id)}
                    >
                      <div className="flex items-center gap-2 text-white text-xs font-medium whitespace-nowrap overflow-hidden">
                        {task.isCritical && (
                          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="truncate">{task.hours}h</span>
                        {task.widthPercent > 8 && (
                          <span className="truncate">- {statusLabels[task.status]}</span>
                        )}
                      </div>
                    </div>

                    {/* Grid lines */}
                    {[25, 50, 75].map(percent => (
                      <div
                        key={percent}
                        className="absolute top-0 h-full border-l border-gray-200"
                        style={{ left: `${percent}%` }}
                      />
                    ))}
                  </div>

                  <div className="w-16 flex-shrink-0 text-right">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: statusColors[task.status] + '20',
                        color: statusColors[task.status]
                      }}
                    >
                      {statusLabels[task.status]}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-6">
              <span className="text-gray-600 font-medium">Status:</span>
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-700">
                    {statusLabels[status as keyof typeof statusLabels]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
              <div className="w-4 h-4 rounded border-2 border-red-500 bg-gray-400" />
              <span className="text-gray-700 font-medium">Critical Path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(GanttChart)
