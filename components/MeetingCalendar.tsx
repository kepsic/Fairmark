'use client'

import { useState } from 'react'

export type Meeting = {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  attendees: string[]
  createdBy: string
  createdAt: string
}

type MeetingCalendarProps = {
  meetings: Meeting[]
  members: Array<{ id: string; name: string }>
  onAddMeeting?: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void
  currentUserName: string
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

function isUpcoming(dateStr: string, startTime: string): boolean {
  const meetingDateTime = new Date(`${dateStr}T${startTime}`)
  return meetingDateTime > new Date()
}

export default function MeetingCalendar({ 
  meetings, 
  members, 
  onAddMeeting,
  currentUserName 
}: MeetingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }
  
  const meetingsByDate: Record<string, Meeting[]> = {}
  meetings.forEach(meeting => {
    if (!meetingsByDate[meeting.date]) {
      meetingsByDate[meeting.date] = []
    }
    meetingsByDate[meeting.date].push(meeting)
  })
  
  const getDateString = (day: number): string => {
    const month = String(currentMonth + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${currentYear}-${month}-${dayStr}`
  }
  
  const selectedMeetings = selectedDate ? (meetingsByDate[selectedDate] || []) : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-xl font-bold text-gray-900 min-w-[200px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          
          <button
            onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            Today
          </button>
          {onAddMeeting && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
            >
              + Add Meeting
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square border-b border-r border-gray-100 bg-gray-50"></div>
            }
            
            const dateStr = getDateString(day)
            const dayMeetings = meetingsByDate[dateStr] || []
            const isTodayDate = isToday(dateStr)
            const hasUpcoming = dayMeetings.some(m => isUpcoming(m.date, m.startTime))
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square border-b border-r border-gray-100 p-1 hover:bg-blue-50 transition-colors relative ${
                  selectedDate === dateStr ? 'bg-blue-100' : ''
                } ${isTodayDate ? 'bg-yellow-50' : ''}`}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm font-medium mb-1 ${
                    isTodayDate ? 'text-blue-600 font-bold' : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  
                  {dayMeetings.length > 0 && (
                    <div className="flex-1 overflow-hidden">
                      {dayMeetings.slice(0, 2).map(meeting => (
                        <div 
                          key={meeting.id}
                          className={`text-[10px] px-1 py-0.5 rounded mb-0.5 truncate ${
                            isUpcoming(meeting.date, meeting.startTime)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                          title={meeting.title}
                        >
                          {meeting.title}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <div className="text-[9px] text-gray-500 text-center">
                          +{dayMeetings.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {isTodayDate && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
                {hasUpcoming && !isTodayDate && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedMeetings.length === 0 ? (
            <p className="text-sm text-gray-500">No meetings scheduled for this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedMeetings.map(meeting => {
                const upcoming = isUpcoming(meeting.date, meeting.startTime)
                return (
                  <div 
                    key={meeting.id}
                    className={`border-l-4 pl-3 py-2 ${
                      upcoming ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{meeting.title}</h5>
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {meeting.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {meeting.attendees.length} attendees
                          </div>
                        </div>
                        {meeting.description && (
                          <p className="text-xs text-gray-600 mt-2">{meeting.description}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        upcoming 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {upcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {showAddForm && onAddMeeting && (
        <AddMeetingForm
          members={members}
          currentUserName={currentUserName}
          onSubmit={(meeting) => {
            onAddMeeting(meeting)
            setShowAddForm(false)
          }}
          onCancel={() => setShowAddForm(false)}
          initialDate={selectedDate || undefined}
        />
      )}
    </div>
  )
}

function AddMeetingForm({
  members,
  currentUserName,
  onSubmit,
  onCancel,
  initialDate
}: {
  members: Array<{ id: string; name: string }>
  currentUserName: string
  onSubmit: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void
  onCancel: () => void
  initialDate?: string
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0])
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
          <h3 className="text-lg font-semibold text-gray-900">Schedule New Meeting</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Weekly Team Sync"
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
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Meeting agenda and details..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-3 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-3 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Zoom, Room 301, Coffee Shop"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendees (optional)
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
              {members.map(member => (
                <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.includes(member.id)}
                    onChange={() => toggleAttendee(member.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
