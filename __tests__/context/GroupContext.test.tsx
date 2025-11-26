import { renderHook, act } from '@testing-library/react'
import { GroupProvider, useGroups } from '@/context/GroupContext'
import { ReactNode } from 'react'

// Mock localStorage before tests
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('GroupContext', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <GroupProvider>{children}</GroupProvider>
  )

  test('should initialize with empty groups', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    expect(result.current.groups).toEqual([])
    expect(result.current.currentUserName).toBeNull()
  })

  test('should set current user name', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('John')
    })
    
    expect(result.current.currentUserName).toBe('John')
    expect(localStorage.getItem('currentUserName')).toBe('John')
  })

  test('should create a new group', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('Alice')
    })

    let groupId: string = ''
    act(() => {
      groupId = result.current.createGroup('Test Project', 'Test description')
    })
    
    expect(result.current.groups).toHaveLength(1)
    expect(result.current.groups[0].name).toBe('Test Project')
    expect(result.current.groups[0].description).toBe('Test description')
    expect(result.current.groups[0].members).toHaveLength(1)
    expect(result.current.groups[0].members[0].name).toBe('Alice')
    expect(result.current.groups[0].totalTasksNeeded).toBe(10)
    expect(groupId).toBeTruthy()
  })

  test('should get a group by id', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('Bob')
    })

    let groupId: string = ''
    act(() => {
      groupId = result.current.createGroup('Project X')
    })
    
    const group = result.current.getGroup(groupId)
    
    expect(group).toBeDefined()
    expect(group?.name).toBe('Project X')
  })

  test('should join an existing group', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('Charlie')
    })

    let groupId: string = ''
    act(() => {
      groupId = result.current.createGroup('Team Project')
    })

    act(() => {
      result.current.joinGroup(groupId, 'David')
    })
    
    const group = result.current.getGroup(groupId)
    expect(group?.members).toHaveLength(2)
    expect(group?.members[1].name).toBe('David')
  })

  test('should not duplicate member when joining same group', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('Eve')
    })

    let groupId: string = ''
    act(() => {
      groupId = result.current.createGroup('Test Group')
    })

    act(() => {
      result.current.joinGroup(groupId, 'Eve')
    })
    
    const group = result.current.getGroup(groupId)
    expect(group?.members).toHaveLength(1)
  })

  test('should add a member to group', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('Frank')
    })

    let groupId: string = ''
    act(() => {
      groupId = result.current.createGroup('Add Member Test')
    })

    act(() => {
      result.current.addMember(groupId, 'Grace')
    })
    
    const group = result.current.getGroup(groupId)
    expect(group?.members).toHaveLength(2)
    expect(group?.members[1].name).toBe('Grace')
  })

  test('should update member contribution', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('Henry')
    })

    let groupId: string = ''
    act(() => {
      groupId = result.current.createGroup('Contribution Test')
    })

    const group = result.current.getGroup(groupId)
    const memberId = group!.members[0].id

    act(() => {
      result.current.updateMemberContribution(groupId, memberId, 5, 3)
    })
    
    const updatedGroup = result.current.getGroup(groupId)
    expect(updatedGroup?.members[0].hours).toBe(5)
    expect(updatedGroup?.members[0].tasks).toBe(3)
  })

  test('should accumulate member contributions', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('Iris')
    })

    let groupId: string = ''
    act(() => {
      groupId = result.current.createGroup('Accumulate Test')
    })

    const group = result.current.getGroup(groupId)
    const memberId = group!.members[0].id

    act(() => {
      result.current.updateMemberContribution(groupId, memberId, 3, 2)
    })

    act(() => {
      result.current.updateMemberContribution(groupId, memberId, 2, 1)
    })
    
    const updatedGroup = result.current.getGroup(groupId)
    expect(updatedGroup?.members[0].hours).toBe(5)
    expect(updatedGroup?.members[0].tasks).toBe(3)
  })

  test('should update group settings', () => {
    const { result } = renderHook(() => useGroups(), { wrapper })
    
    act(() => {
      result.current.setCurrentUserName('Jack')
    })

    let groupId: string = ''
    act(() => {
      groupId = result.current.createGroup('Settings Test')
    })

    act(() => {
      result.current.updateGroupSettings(
        groupId,
        'Updated Project Name',
        'Updated description',
        25
      )
    })
    
    const group = result.current.getGroup(groupId)
    expect(group?.name).toBe('Updated Project Name')
    expect(group?.description).toBe('Updated description')
    expect(group?.totalTasksNeeded).toBe(25)
  })
})
