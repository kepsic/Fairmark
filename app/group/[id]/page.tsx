'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGroups } from '@/context/GroupContext'
import ProgressBar from '@/components/ProgressBar'
import ContributionTable from '@/components/ContributionTable'
import ContributionGraph from '@/components/ContributionGraph'
import FairnessBadge from '@/components/FairnessBadge'
import TaskTable from '@/components/TaskTable'
import GanttChart from '@/components/GanttChart'
import TaskModal from '@/components/TaskModal'

type SortField = 'title' | 'status' | 'assignedTo' | 'hours'
type SortOrder = 'asc' | 'desc'
type StatusFilter = 'all' | 'todo' | 'in-progress' | 'done'

export default function GroupDashboard({ params }: { params: { id: string } }) {
  const [showCopied, setShowCopied] = useState(false)
  const [filteredMemberId, setFilteredMemberId] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'gantt'>('gantt')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const router = useRouter()
  const { getGroup, currentUserName, autoAssignTasks } = useGroups()
  const group = getGroup(params.id)

  useEffect(() => {
    if (!currentUserName) {
      router.push('/login')
    }
  }, [currentUserName, router])

  if (!currentUserName) {
    return null
  }

  if (!group) {
    return (
      <div className="p-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 mb-4 text-center">
            <h1 className="text-xl font-bold mb-2 text-[#003A79]">Project Not Found</h1>
            <p className="text-[#333333] mb-4">
              The project you are looking for does not exist.
            </p>
            <Link
              href="/groups"
              className="inline-block bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalLoggedTasks = group.members.reduce((sum, m) => sum + m.tasks, 0)

  // Filter, search, and sort tasks
  const filteredTasks = group.tasks
    // Filter by member
    .filter(task => !filteredMemberId || task.assignedTo === filteredMemberId)
    // Filter by status
    .filter(task => statusFilter === 'all' || task.status === statusFilter)
    // Filter by search query
    .filter(task => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return task.title.toLowerCase().includes(query) || 
             (task.description?.toLowerCase().includes(query) ?? false)
    })
    // Sort
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'status':
          const statusOrder = { 'todo': 0, 'in-progress': 1, 'done': 2 }
          comparison = statusOrder[a.status] - statusOrder[b.status]
          break
        case 'assignedTo':
          const aName = group.members.find(m => m.id === a.assignedTo)?.name || ''
          const bName = group.members.find(m => m.id === b.assignedTo)?.name || ''
          comparison = aName.localeCompare(bName)
          break
        case 'hours':
          comparison = a.hours - b.hours
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const filteredMember = filteredMemberId 
    ? group.members.find(m => m.id === filteredMemberId)
    : null

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/groups" className="text-[#005BB5] hover:underline text-sm">
            ← Back to projects
          </Link>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1 text-[#003A79]">
                {group.name}
              </h1>
              {group.description && (
                <p className="text-[#333333]">{group.description}</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                const url = `${window.location.origin}/group/${group.id}`
                navigator.clipboard.writeText(url)
                setShowCopied(true)
                setTimeout(() => setShowCopied(false), 2000)
              }}
              className="relative flex items-center gap-2 px-3 py-2 text-sm text-[#003A79] hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
              title="Copy project link"
            >
              {showCopied ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Link copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 text-[#003A79]">Overall Progress</h2>
          <ProgressBar
            current={totalLoggedTasks}
            total={group.totalTasksNeeded}
          />
        </div>

        {/* Fairness Badge */}
        <div className="mb-6 flex justify-center">
          <FairnessBadge members={group.members} tasks={group.tasks} />
        </div>

        {/* Task Table */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg mb-4 overflow-hidden" data-section="tasks">
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#003A79]">Project Tasks</h2>
                {filteredMember && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                      Filtered by: <span className="font-medium text-[#003A79]">{filteredMember.name}</span>
                    </span>
                    <button
                      onClick={() => setFilteredMemberId(null)}
                      className="text-xs text-[#005BB5] hover:underline"
                    >
                      Clear filter
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    const assigned = await autoAssignTasks(params.id)
                    if (assigned > 0) {
                      alert(`Auto-assigned ${assigned} unassigned tasks to team members.`)
                    } else {
                      alert('No unassigned tasks to distribute.')
                    }
                  }}
                  className="text-sm bg-[#003A79] text-white font-semibold rounded-md px-3 py-1 hover:bg-[#002d5c] transition"
                >
                  Auto-Assign
                </button>
                <Link
                  href={`/group/${params.id}/tasks/new`}
                  className="text-sm bg-[#D4A017] text-white font-semibold rounded-md px-3 py-1 hover:bg-[#b58912] transition"
                >
                  New Task
                </Link>
              </div>
            </div>
            
            {/* Filters and Search */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005BB5] focus:border-transparent"
                />
              </div>
              
              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005BB5] focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Sort by:</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005BB5] focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="title">Task Name</option>
                  <option value="status">Status</option>
                  <option value="assignedTo">Assigned To</option>
                  <option value="hours">Hours</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Clear All Filters */}
              {(searchQuery || statusFilter !== 'all' || filteredMemberId) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setFilteredMemberId(null)
                  }}
                  className="text-xs text-[#005BB5] hover:underline whitespace-nowrap"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            {/* Results count and view toggle */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                Showing {filteredTasks.length} of {group.tasks.length} tasks
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-[#003A79] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Table</span>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('gantt')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === 'gantt'
                      ? 'bg-[#003A79] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Timeline</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Table or Gantt View */}
          {viewMode === 'table' ? (
            <TaskTable 
              tasks={filteredTasks} 
              groupId={params.id} 
              members={group.members} 
              currentUserName={currentUserName}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <div className="p-6">
              <GanttChart 
                tasks={filteredTasks} 
                members={group.members}
                onTaskClick={(taskId) => setSelectedTaskId(taskId)}
              />
            </div>
          )}
        </div>

        {/* Task Modal */}
        {selectedTaskId && (() => {
          const selectedTask = group.tasks.find(t => t.id === selectedTaskId)
          return selectedTask ? (
            <TaskModal
              task={selectedTask}
              members={group.members}
              groupId={params.id}
              currentUserName={currentUserName}
              onClose={() => setSelectedTaskId(null)}
            />
          ) : null
        })()}

        {/* Contribution Graph */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg mb-4 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-[#003A79]">Contribution Distribution</h2>
          </div>
          <div className="p-4">
            <ContributionGraph members={group.members} tasks={group.tasks} />
          </div>
        </div>

        {/* Contribution Table */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg mb-4 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-[#003A79]">Team Contributions</h2>
            <p className="text-xs text-gray-600 mt-1">Click on a member to filter tasks</p>
          </div>
          <ContributionTable 
            members={group.members} 
            tasks={group.tasks} 
            onMemberClick={(memberId) => {
              setFilteredMemberId(filteredMemberId === memberId ? null : memberId)
              // Scroll to tasks section
              document.querySelector('[data-section="tasks"]')?.scrollIntoView({ behavior: 'smooth' })
            }}
            selectedMemberId={filteredMemberId}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/group/${params.id}/contribute`}
            className="block w-full bg-[#D4A017] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#b58912] transition text-center"
          >
            Add Work
          </Link>

          <Link
            href={`/group/${params.id}/add-member`}
            className="block w-full border border-[#003A79] text-[#003A79] px-5 py-2 rounded-md hover:bg-[#003A79] hover:text-white transition text-center font-semibold"
          >
            Add Member
          </Link>

          <Link
            href={`/group/${params.id}/settings`}
            className="block w-full bg-gray-200 text-gray-700 rounded-md px-4 py-3 text-center font-medium hover:bg-gray-300 transition"
          >
            Project Settings
          </Link>
        </div>

        {/* Share Project Link */}
        <div className="mt-6 bg-white border border-gray-200 shadow-sm rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-[#333333] mb-2">Share this project:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-3 py-2 rounded border text-xs break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/group/${group.id}` : `/group/${group.id}`}
            </code>
            <button
              onClick={() => {
                const url = `${window.location.origin}/group/${group.id}`
                navigator.clipboard.writeText(url)
                setShowCopied(true)
                setTimeout(() => setShowCopied(false), 2000)
              }}
              className="bg-[#005BB5] text-white px-3 py-2 rounded text-sm hover:bg-[#004a99] transition whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
