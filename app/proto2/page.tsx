'use client'

import { useState } from 'react'
import Link from 'next/link'

type ProcessStep = {
  id: number
  title: string
  description: string
  icon: string
  actions: string[]
  status: 'pending' | 'current' | 'completed'
  estimatedTime?: string
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Group Assignment',
    description: 'Receive project assignment and form your team. University assigns group members or students form teams based on course requirements.',
    icon: '👥',
    actions: [
      'Receive project brief from instructor',
      'Meet your assigned team members',
      'Exchange contact information',
      'Review project requirements together'
    ],
    status: 'completed',
    estimatedTime: 'Week 1, Day 1'
  },
  {
    id: 2,
    title: 'Create Communication Channels',
    description: 'Set up dedicated spaces for team communication and collaboration to ensure everyone stays connected.',
    icon: '💬',
    actions: [
      'Create Discord/Slack/WhatsApp group',
      'Set up shared Google Drive folder',
      'Add everyone to project management tool',
      'Establish communication norms (response times, preferred channels)'
    ],
    status: 'completed',
    estimatedTime: 'Week 1, Day 1-2'
  },
  {
    id: 3,
    title: 'Kickoff Meeting',
    description: 'First team meeting to align on goals, expectations, and working styles. This is where the foundation for collaboration is built.',
    icon: '🚀',
    actions: [
      'Introduce yourselves and share backgrounds',
      'Discuss individual strengths and interests',
      'Review project scope and deliverables',
      'Set team ground rules and expectations',
      'Agree on meeting schedule',
      'Define success criteria together'
    ],
    status: 'completed',
    estimatedTime: 'Week 1, Day 2-3'
  },
  {
    id: 4,
    title: 'Assign Roles',
    description: 'Distribute functional roles based on strengths and interests. Everyone should have at least one clear responsibility.',
    icon: '🎭',
    actions: [
      'Identify needed roles (Writer, Designer, Researcher, Presenter, Coordinator, QA)',
      'Match roles to individual strengths',
      'Document who is responsible for what',
      'Plan for role rotation if project is long-term',
      'Ensure workload balance across team'
    ],
    status: 'completed',
    estimatedTime: 'Week 1, Day 3-4'
  },
  {
    id: 5,
    title: 'Break Down & Assign Tasks',
    description: 'Decompose the project into concrete, manageable tasks with clear owners and deadlines.',
    icon: '📋',
    actions: [
      'Break project into phases and milestones',
      'Create specific, actionable tasks',
      'Assign tasks to team members',
      'Set realistic deadlines for each task',
      'Estimate effort (hours) for each task',
      'Identify task dependencies',
      'Document everything in Fairmark'
    ],
    status: 'current',
    estimatedTime: 'Week 1, Day 4-5'
  },
  {
    id: 6,
    title: 'Regular Check-ins',
    description: 'Weekly synchronization meetings to share progress, address blockers, and maintain momentum.',
    icon: '📊',
    actions: [
      'Schedule recurring weekly meetings',
      'Each member submits weekly check-in (What did I do? What blocked me? What will I do next?)',
      'Review task progress as a team',
      'Identify and resolve blockers',
      'Adjust plans based on progress',
      'Celebrate small wins',
      'Flag if someone needs support'
    ],
    status: 'pending',
    estimatedTime: 'Weeks 2-10 (ongoing)'
  },
  {
    id: 7,
    title: 'Mid-Project Review',
    description: 'Pause to assess progress, gather feedback, and make necessary adjustments to stay on track.',
    icon: '🔍',
    actions: [
      'Review completed vs planned work',
      'Assess contribution balance',
      'Collect anonymous peer feedback',
      'Identify what&apos;s working and what isn&apos;t',
      'Adjust task assignments if needed',
      'Rebalance workload if uneven',
      'Course-correct before it&apos;s too late'
    ],
    status: 'pending',
    estimatedTime: 'Week 5-6 (midpoint)'
  },
  {
    id: 8,
    title: 'Final Sprint',
    description: 'Intensive final push to complete remaining work, integrate all parts, and polish the deliverable.',
    icon: '⚡',
    actions: [
      'Complete all remaining tasks',
      'Integrate individual contributions',
      'Conduct internal quality review',
      'Practice presentation (if applicable)',
      'Prepare final documentation',
      'Run through submission checklist'
    ],
    status: 'pending',
    estimatedTime: 'Week 11-12'
  },
  {
    id: 9,
    title: 'Project Submission',
    description: 'Submit the completed project and reflect on the team collaboration experience.',
    icon: '🎯',
    actions: [
      'Submit all deliverables on time',
      'Complete final peer evaluations',
      'Review contribution scores',
      'Submit individual reflections (if required)',
      'Celebrate as a team! 🎉'
    ],
    status: 'pending',
    estimatedTime: 'Week 12 (deadline)'
  },
  {
    id: 10,
    title: 'Retrospective',
    description: 'Look back on what worked, what didn&apos;t, and lessons learned for future group work.',
    icon: '🔄',
    actions: [
      'What went well? (Keep doing)',
      'What could be improved? (Change next time)',
      'What did we learn about teamwork?',
      'How did Fairmark help with fairness?',
      'Document lessons learned'
    ],
    status: 'pending',
    estimatedTime: 'After submission'
  }
]

export default function Proto2Page() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const getStatusColor = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-300'
      case 'current':
        return 'bg-blue-50 border-blue-400 shadow-lg'
      case 'pending':
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusBadge = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Completed</span>
      case 'current':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">→ Current Step</span>
      case 'pending':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">⏳ Upcoming</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Group Work Process
              </h1>
              <p className="text-gray-600 mt-2">
                A social agreement for fair and successful team collaboration
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(processSteps.filter(s => s.status === 'completed').length / processSteps.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {processSteps.filter(s => s.status === 'completed').length}/{processSteps.length} Steps
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-bold text-green-600">{processSteps.filter(s => s.status === 'completed').length}</p>
              <p className="text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{processSteps.filter(s => s.status === 'current').length}</p>
              <p className="text-gray-600">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-400">{processSteps.filter(s => s.status === 'pending').length}</p>
              <p className="text-gray-600">Upcoming</p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-6">
          {processSteps.map((step, index) => (
            <div key={step.id}>
              {/* Connector Line */}
              {index > 0 && (
                <div className="flex justify-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded"></div>
                </div>
              )}

              {/* Step Card */}
              <div
                className={`border-2 rounded-xl transition-all duration-300 ${getStatusColor(step.status)} ${
                  expandedStep === step.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleStep(step.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md border-2 border-gray-200">
                        {step.icon}
                      </div>
                      <div className="text-center mt-2 text-xs font-bold text-gray-500">
                        Step {step.id}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {step.title}
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-2">
                          {getStatusBadge(step.status)}
                          <svg
                            className={`w-6 h-6 text-gray-400 transition-transform ${
                              expandedStep === step.id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {step.estimatedTime && (
                        <div className="flex items-center gap-2 mt-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-600 font-medium">{step.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedStep === step.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Action Items:
                      </h4>
                      <ul className="space-y-2">
                        {step.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Social Agreement */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🤝 Our Social Agreement
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
              By following this process, we commit to transparent communication, fair contribution tracking, 
              and mutual support. Everyone&apos;s work will be visible and valued. No one gets left behind, 
              and no one carries the whole load alone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="text-2xl mb-2">💪</div>
                <p className="font-semibold text-gray-900">We contribute fairly</p>
                <p className="text-gray-600 text-xs mt-1">Track and balance workload</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="text-2xl mb-2">🔍</div>
                <p className="font-semibold text-gray-900">We stay transparent</p>
                <p className="text-gray-600 text-xs mt-1">Share progress openly</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="text-2xl mb-2">🙋</div>
                <p className="font-semibold text-gray-900">We support each other</p>
                <p className="text-gray-600 text-xs mt-1">Help when someone struggles</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/groups"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
              >
                Start Your Project Journey →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-12"></div>
    </div>
  )
}
