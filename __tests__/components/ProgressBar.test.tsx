import { render, screen } from '@testing-library/react'
import ProgressBar from '@/components/ProgressBar'

describe('ProgressBar', () => {
  test('renders with correct percentage', () => {
    render(<ProgressBar current={5} total={10} />)

    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('5 tasks completed')).toBeInTheDocument()
    expect(screen.getByText('10 tasks needed')).toBeInTheDocument()
  })

  test('handles zero total without crashing', () => {
    render(<ProgressBar current={0} total={0} />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  test('caps percentage at 100%', () => {
    render(<ProgressBar current={15} total={10} />)

    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  test('renders progress bar with correct width', () => {
    const { container } = render(<ProgressBar current={7} total={10} />)

    const progressElement = container.querySelector('.bg-blue-600')
    expect(progressElement).toHaveStyle({ width: '70%' })
  })
})
