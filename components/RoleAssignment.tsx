'use client'

import { useState } from 'react'
import type { Member } from '@/context/GroupContext'
import type { MemberRole } from '@/lib/firebase/types'

const AVAILABLE_ROLES: { value: MemberRole; label: string; description: string }[] = [
  { value: 'writer', label: '✍️ Writer', description: 'Documentation & reports' },
  { value: 'presenter', label: '🎤 Presenter', description: 'Presentations & demos' },
  { value: 'coordinator', label: '📋 Coordinator', description: 'Planning & organization' },
  { value: 'researcher', label: '🔍 Researcher', description: 'Research & analysis' },
  { value: 'qa', label: '✅ QA', description: 'Testing & quality assurance' },
  { value: 'designer', label: '🎨 Designer', description: 'UI/UX & visual design' },
  { value: 'sherpa', label: '⛰️ Sherpa', description: 'Project guide & mentor' },
  { value: 'member', label: '👤 Member', description: 'General contributor' },
]

type RoleAssignmentProps = {
  members: Member[]
  onUpdateMemberRoles: (memberId: string, roles: MemberRole[]) => void
}

export default function RoleAssignment({ members, onUpdateMemberRoles }: RoleAssignmentProps) {
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<MemberRole[]>([])

  const handleEditClick = (member: Member) => {
    setEditingMemberId(member.id)
    setSelectedRoles(member.assignedRoles || [])
  }

  const handleToggleRole = (role: MemberRole) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleSave = (memberId: string) => {
    onUpdateMemberRoles(memberId, selectedRoles)
    setEditingMemberId(null)
  }

  const handleCancel = () => {
    setEditingMemberId(null)
    setSelectedRoles([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Role Assignments</h3>
        <p className="text-xs text-gray-500">Each member can have multiple roles</p>
      </div>

      {members.map(member => (
        <div
          key={member.id}
          className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">
                    {member.tasks} tasks • {member.hours}h
                  </p>
                </div>
              </div>

              {editingMemberId === member.id ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-600 mb-2">Select roles:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_ROLES.map(role => (
                      <label
                        key={role.value}
                        className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                          selectedRoles.includes(role.value)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role.value)}
                          onChange={() => handleToggleRole(role.value)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{role.label}</p>
                          <p className="text-[10px] text-gray-500 truncate">{role.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleSave(member.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Save Roles
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  {member.assignedRoles && member.assignedRoles.length > 0 ? (
                    member.assignedRoles.map(roleValue => {
                      const roleInfo = AVAILABLE_ROLES.find(r => r.value === roleValue)
                      return (
                        <span
                          key={roleValue}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {roleInfo?.label || roleValue}
                        </span>
                      )
                    })
                  ) : (
                    <span className="text-xs text-gray-400 italic">No roles assigned</span>
                  )}
                </div>
              )}
            </div>

            {editingMemberId !== member.id && (
              <button
                onClick={() => handleEditClick(member)}
                className="ml-2 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
