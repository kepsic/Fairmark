import { render, screen } from '@testing-library/react'
import FairnessBadge from '@/components/FairnessBadge'
import { Member } from '@/context/GroupContext'

describe('FairnessBadge', () => {
  test('shows "Balanced" when contributions are even', () => {
    const members: Member[] = [
      { id: '1', name: 'Alice', hours: 10, tasks: 4 },
      { id: '2', name: 'Bob', hours: 10, tasks: 4 },
      { id: '3', name: 'Charlie', hours: 10, tasks: 4 },
    ]
    
    render(<FairnessBadge members={members} />)
    
    expect(screen.getByText('Balanced')).toBeInTheDocument()
    expect(screen.getByText('Balanced')).toHaveClass('bg-green-100')
  })

  test('shows "Unbalanced" when one member has >50%', () => {
    const members: Member[] = [
      { id: '1', name: 'Alice', hours: 20, tasks: 10 }, // 25 points
      { id: '2', name: 'Bob', hours: 5, tasks: 2 }, // 6 points
      { id: '3', name: 'Charlie', hours: 5, tasks: 2 }, // 6 points
    ]
    // Alice: 67.6% > 50%
    
    render(<FairnessBadge members={members} />)
    
    expect(screen.getByText('Unbalanced')).toBeInTheDocument()
    expect(screen.getByText('Unbalanced')).toHaveClass('bg-red-100')
  })

  test('shows "Slightly Unbalanced" when top two have >80%', () => {
    const members: Member[] = [
      { id: '1', name: 'Alice', hours: 10, tasks: 5 }, // 12.5 points
      { id: '2', name: 'Bob', hours: 10, tasks: 5 }, // 12.5 points
      { id: '3', name: 'Charlie', hours: 3, tasks: 1 }, // 3.5 points
      { id: '4', name: 'David', hours: 0, tasks: 0 }, // 0 points
    ]
    // Alice + Bob = 87.7% > 80%
    
    render(<FairnessBadge members={members} />)
    
    expect(screen.getByText('Slightly Unbalanced')).toBeInTheDocument()
    expect(screen.getByText('Slightly Unbalanced')).toHaveClass('bg-yellow-100')
  })

  test('handles empty member list', () => {
    render(<FairnessBadge members={[]} />)
    
    expect(screen.getByText('Balanced')).toBeInTheDocument()
  })

  test('handles single member', () => {
    const members: Member[] = [
      { id: '1', name: 'Alice', hours: 10, tasks: 5 },
    ]
    
    render(<FairnessBadge members={members} />)
    
    // Single member = 100% but should show unbalanced
    expect(screen.getByText('Unbalanced')).toBeInTheDocument()
  })
})
