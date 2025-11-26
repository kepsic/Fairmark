'use client'

import { useState } from 'react'

export type Meeting = {
  id: string
  title: string
  description: string
  date: string // ISO date string
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  location: string
  attendees: string[] // member IDs
  createdBy: string
  createdAt: string
}

type MeetingCalendarProps = {
  meetings: Meeting[]
  members: Array<{ id: string; name: string }>
  onAddMeeting?: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void
  currentUserName: string
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

function isUpcoming(dateStr: string, startTime: string): boolean {
  const meetingDateTime = new Date(`${dateStr}T${startTime}`)
  return meetingDateTime > new Date()
}

function isPast(dateStr: string, endTime: string): boolean {
  const meetingDateTime = new Date(`${dateStr}T${endTime}`)
  return meetingDateTime < new Date()
}

export default function MeetingCalendar({ 
  meetings, 
  members, 
  onAddMeeting,
  currentUserName 
}: MeetingCalendarProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewMode, setViewMode] = useState<'upcoming' | 'all'>('upcoming')

  // Sort meetings by date
  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`)
    const dateB = new Date(`${b.date}T${b.startTime}`)
    return dateA.getTime() - dateB.getTime()
  })

  const upcomingMeetings = sortedMeetings.filter(m => isUpcoming(m.date, m.startTime))
  const displayMeetings = viewMode === 'upcoming' ? upcomingMeetings : sortedMeetings

  return (
    <div className="space-y-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('upcoming')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              viewMode === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upcoming ({upcomingMeetings.length})
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({sortedMeetings.length})
          </button>
        </div>

        {onAddMeeting && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
          >
            + Schedule Meeting
          </button>
        )}
      </div>

      {/* Meetings List */}
      {displayMeetings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">
            {viewMode === 'upcoming' ? 'No upcoming meetings' : 'No meetings scheduled'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {viewMode === 'upcoming' 
              ? 'Schedule a meeting to coordinate with your team'
              : 'Click "Schedule Meeting" to add your first meeting'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayMeetings.map(meeting => {
            const isUpcomingMeeting = isUpcoming(meeting.date, meeting.startTime)
            const isPastMeeting = isPast(meeting.date, meeting.endTime)
            const attendeeNames = meeting.attendees
              .map(id => members.find(m => m.id === id)?.name)
              .filter(Boolean)

            return (
              <div
                key={meeting.id}
                className={`border rounded-lg p-4 transition-all ${
                  isPastMeeting
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : isUpcomingMeeting
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                      {isUpcomingMeeting && !isPastMeeting && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Upcoming
                        </span>
                      )}
                      {isPastMeeting && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                          Past
                        </span>
                      )}
                    </div>
                    {meeting.description && (
                      <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(meeting.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{meeting.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{attendeeNames.length} attendees</span>
                  </div>
                </div>

                {attendeeNames.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Attendees:</p>
                    <div className="flex flex-wrap gap-2">
                      {attendeeNames.map((name, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Meeting Form Modal */}
      {showAddForm && onAddMeeting && (
        <AddMeetingForm
          members={members}
          currentUserName={currentUserName}
          onSubmit={(meeting) => {
            onAddMeeting(meeting)
            setShowAddForm(false)
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}

// Add Meeting Form Component
function AddMeetingForm({
  members,
  currentUserName,
  onSubmit,
  onCancel,
}: {
  members: Array<{ id: string; name: string }>
  currentUserName: string
  onSubmit: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('14:00')
  const [endTime, setEndTime] = useState('15:00')
  const [location, setLocation] = useState('')
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !date || !startTime || !endTime || !location) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      attendees: selectedAttendees,
      createdBy: currentUserName,
    })
  }

  const toggleAttendee = (memberId: string) => {
    setSelectedAttendees(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Schedule New Meeting</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sprint Planning Meeting"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will be discussed?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Zoom, Room 305, Library"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendees (optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {members.map(member => (
                <label
                  key={member.id}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${
                    selectedAttendees.includes(member.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAttendees.includes(member.id)}
                    onChange={() => toggleAttendee(member.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule Meeting
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
