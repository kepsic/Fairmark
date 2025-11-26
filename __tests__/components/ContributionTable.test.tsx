import { render, screen } from '@testing-library/react'
import ContributionTable from '@/components/ContributionTable'
import { Member } from '@/context/GroupContext'

describe('ContributionTable', () => {
  const mockMembers: Member[] = [
    { id: '1', name: 'Alice', hours: 10, tasks: 5, role: 'member' },
    { id: '2', name: 'Bob', hours: 5, tasks: 3, role: 'member' },
    { id: '3', name: 'Charlie', hours: 0, tasks: 0, role: 'member' },
  ]

  test('renders table with member data', () => {
    render(<ContributionTable members={mockMembers} tasks={[]} />)
    
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  test('calculates contribution percentages correctly', () => {
    render(<ContributionTable members={mockMembers} tasks={[]} />)
    
    // Alice: 10 + 5*0.5 = 12.5
    // Bob: 5 + 3*0.5 = 6.5
    // Charlie: 0 + 0*0.5 = 0
    // Total: 19
    // Alice: 65.8%, Bob: 34.2%, Charlie: 0%
    
    expect(screen.getByText('65.8%')).toBeInTheDocument()
    expect(screen.getByText('34.2%')).toBeInTheDocument()
    expect(screen.getByText('0.0%')).toBeInTheDocument()
  })

  test('displays empty state when no members', () => {
    render(<ContributionTable members={[]} tasks={[]} />)
    
    expect(screen.getByText(/No members yet/i)).toBeInTheDocument()
  })

  test('displays hours and tasks correctly', () => {
    render(<ContributionTable members={mockMembers} tasks={[]} />)
    
    // Now the table shows task hours separately from manual hours
    // For Alice with no tasks assigned: 0h (task) + 10h (manual) + 5 manual tasks
    // For Bob with no tasks assigned: 0h (task) + 5h (manual) + 3 manual tasks
    expect(screen.getByText('10h')).toBeInTheDocument() // Alice manual hours
    expect(screen.getByText('5h')).toBeInTheDocument() // Bob manual hours
  })
})
