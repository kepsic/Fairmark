import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  orderBy,
} from 'firebase/firestore'
import { getFirebaseDb } from './config'
import type { UserDoc, GroupDoc, MemberDoc, TaskDoc, GroupWithData } from './types'

// Collection names
const USERS_COLLECTION = 'users'
const GROUPS_COLLECTION = 'groups'
const MEMBERS_COLLECTION = 'members'
const TASKS_COLLECTION = 'tasks'

/**
 * Get all groups with their members and tasks
 */
export async function getAllGroups(): Promise<GroupWithData[]> {
  const db = getFirebaseDb()

  try {
    // Get all groups
    const groupsSnap = await getDocs(collection(db, GROUPS_COLLECTION))
    const groups: GroupWithData[] = []

    for (const groupDoc of groupsSnap.docs) {
      const groupData = groupDoc.data() as GroupDoc

      // Get members for this group
      const membersQuery = query(
        collection(db, MEMBERS_COLLECTION),
        where('groupId', '==', groupData.id)
      )
      const membersSnap = await getDocs(membersQuery)
      const members = membersSnap.docs.map(d => d.data() as MemberDoc)

      // Get tasks for this group
      const tasksQuery = query(
        collection(db, TASKS_COLLECTION),
        where('groupId', '==', groupData.id)
      )
      const tasksSnap = await getDocs(tasksQuery)
      const tasks = tasksSnap.docs.map(d => d.data() as TaskDoc)

      groups.push({
        ...groupData,
        members,
        tasks,
      })
    }

    return groups
  } catch (error) {
    console.error('Error getting all groups:', error)
    throw error
  }
}

/**
 * Get a single group by ID with its members and tasks
 */
export async function getGroupById(groupId: string): Promise<GroupWithData | null> {
  const db = getFirebaseDb()

  try {
    const groupDocRef = doc(db, GROUPS_COLLECTION, groupId)
    const groupSnap = await getDoc(groupDocRef)

    if (!groupSnap.exists()) {
      return null
    }

    const groupData = groupSnap.data() as GroupDoc

    // Get members
    const membersQuery = query(
      collection(db, MEMBERS_COLLECTION),
      where('groupId', '==', groupId)
    )
    const membersSnap = await getDocs(membersQuery)
    const members = membersSnap.docs.map(d => d.data() as MemberDoc)

    // Get tasks
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where('groupId', '==', groupId)
    )
    const tasksSnap = await getDocs(tasksQuery)
    const tasks = tasksSnap.docs.map(d => d.data() as TaskDoc)

    return {
      ...groupData,
      members,
      tasks,
    }
  } catch (error) {
    console.error('Error getting group:', error)
    throw error
  }
}

/**
 * Create a new group
 */
export async function createGroup(group: GroupDoc): Promise<void> {
  const db = getFirebaseDb()

  try {
    const groupDocRef = doc(db, GROUPS_COLLECTION, group.id)
    await setDoc(groupDocRef, group)
  } catch (error) {
    console.error('Error creating group:', error)
    throw error
  }
}

/**
 * Update a group
 */
export async function updateGroup(groupId: string, updates: Partial<GroupDoc>): Promise<void> {
  const db = getFirebaseDb()

  try {
    const groupDocRef = doc(db, GROUPS_COLLECTION, groupId)
    await updateDoc(groupDocRef, updates as any)
  } catch (error) {
    console.error('Error updating group:', error)
    throw error
  }
}

/**
 * Delete a group and all its members and tasks
 */
export async function deleteGroup(groupId: string): Promise<void> {
  const db = getFirebaseDb()

  try {
    const batch = writeBatch(db)

    // Delete group
    batch.delete(doc(db, GROUPS_COLLECTION, groupId))

    // Delete all members
    const membersQuery = query(
      collection(db, MEMBERS_COLLECTION),
      where('groupId', '==', groupId)
    )
    const membersSnap = await getDocs(membersQuery)
    membersSnap.docs.forEach(memberDoc => {
      batch.delete(memberDoc.ref)
    })

    // Delete all tasks
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where('groupId', '==', groupId)
    )
    const tasksSnap = await getDocs(tasksQuery)
    tasksSnap.docs.forEach(taskDoc => {
      batch.delete(taskDoc.ref)
    })

    await batch.commit()
  } catch (error) {
    console.error('Error deleting group:', error)
    throw error
  }
}

/**
 * Add a member to a group
 */
export async function addMember(member: MemberDoc): Promise<void> {
  const db = getFirebaseDb()

  try {
    const memberDocRef = doc(db, MEMBERS_COLLECTION, member.id)
    await setDoc(memberDocRef, member)
  } catch (error) {
    console.error('Error adding member:', error)
    throw error
  }
}

/**
 * Update a member
 */
export async function updateMember(memberId: string, updates: Partial<MemberDoc>): Promise<void> {
  const db = getFirebaseDb()

  try {
    const memberDocRef = doc(db, MEMBERS_COLLECTION, memberId)
    await updateDoc(memberDocRef, updates as any)
  } catch (error) {
    console.error('Error updating member:', error)
    throw error
  }
}

/**
 * Remove a member from a group
 */
export async function removeMember(memberId: string): Promise<void> {
  const db = getFirebaseDb()

  try {
    const memberDocRef = doc(db, MEMBERS_COLLECTION, memberId)
    await deleteDoc(memberDocRef)
  } catch (error) {
    console.error('Error removing member:', error)
    throw error
  }
}

/**
 * Add a task to a group
 */
export async function addTask(task: TaskDoc): Promise<void> {
  const db = getFirebaseDb()

  try {
    const taskDocRef = doc(db, TASKS_COLLECTION, task.id)
    await setDoc(taskDocRef, task)
  } catch (error) {
    console.error('Error adding task:', error)
    throw error
  }
}

/**
 * Update a task
 */
export async function updateTask(taskId: string, updates: Partial<TaskDoc>): Promise<void> {
  const db = getFirebaseDb()

  try {
    const taskDocRef = doc(db, TASKS_COLLECTION, taskId)
    await updateDoc(taskDocRef, updates as any)
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  const db = getFirebaseDb()

  try {
    const taskDocRef = doc(db, TASKS_COLLECTION, taskId)
    await deleteDoc(taskDocRef)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

/**
 * Bulk insert multiple groups with their members and tasks
 */
export async function bulkInsertGroups(groups: GroupWithData[]): Promise<void> {
  const db = getFirebaseDb()

  try {
    console.log(`Bulk inserting ${groups.length} groups...`)
    let batch = writeBatch(db)
    let operationCount = 0

    for (const group of groups) {
      console.log(`Inserting group: ${group.name} with ${group.members.length} members and ${group.tasks.length} tasks`)

      // Add group
      const groupDocRef = doc(db, GROUPS_COLLECTION, group.id)
      batch.set(groupDocRef, {
        id: group.id,
        name: group.name,
        description: group.description,
        createdAt: group.createdAt,
      })
      operationCount++

      // Add members
      for (const member of group.members) {
        const memberDocRef = doc(db, MEMBERS_COLLECTION, member.id)
        batch.set(memberDocRef, member)
        operationCount++

        // Firestore batch limit is 500 operations
        if (operationCount >= 450) {
          console.log(`Committing batch (${operationCount} operations)...`)
          await batch.commit()
          batch = writeBatch(db) // Create new batch
          operationCount = 0
        }
      }

      // Add tasks
      for (const task of group.tasks) {
        const taskDocRef = doc(db, TASKS_COLLECTION, task.id)
        batch.set(taskDocRef, task)
        operationCount++

        if (operationCount >= 450) {
          console.log(`Committing batch (${operationCount} operations)...`)
          await batch.commit()
          batch = writeBatch(db) // Create new batch
          operationCount = 0
        }
      }
    }

    if (operationCount > 0) {
      console.log(`Committing final batch (${operationCount} operations)...`)
      await batch.commit()
    }

    console.log('Bulk insert completed successfully')
  } catch (error) {
    console.error('Error bulk inserting groups:', error)
    throw error
  }
}

/**
 * Clear all data (for testing)
 */
export async function clearAllData(): Promise<void> {
  const db = getFirebaseDb()

  try {
    const batch = writeBatch(db)
    let operationCount = 0

    // Delete all groups
    const groupsSnap = await getDocs(collection(db, GROUPS_COLLECTION))
    groupsSnap.docs.forEach(docSnap => {
      batch.delete(docSnap.ref)
      operationCount++
    })

    // Delete all members
    const membersSnap = await getDocs(collection(db, MEMBERS_COLLECTION))
    membersSnap.docs.forEach(docSnap => {
      batch.delete(docSnap.ref)
      operationCount++
    })

    // Delete all tasks
    const tasksSnap = await getDocs(collection(db, TASKS_COLLECTION))
    tasksSnap.docs.forEach(docSnap => {
      batch.delete(docSnap.ref)
      operationCount++
    })

    if (operationCount > 0) {
      await batch.commit()
    }
  } catch (error) {
    console.error('Error clearing all data:', error)
    throw error
  }
}

/**
 * User Management Operations
 */

/**
 * Get all users
 */
export async function getAllUsers(): Promise<UserDoc[]> {
  const db = getFirebaseDb()

  try {
    const usersSnap = await getDocs(collection(db, USERS_COLLECTION))
    return usersSnap.docs.map(d => d.data() as UserDoc)
  } catch (error) {
    console.error('Error getting all users:', error)
    throw error
  }
}

/**
 * Get a user by ID
 */
export async function getUserById(userId: string): Promise<UserDoc | null> {
  const db = getFirebaseDb()

  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId)
    const userSnap = await getDoc(userDocRef)

    if (!userSnap.exists()) {
      return null
    }

    return userSnap.data() as UserDoc
  } catch (error) {
    console.error('Error getting user by ID:', error)
    throw error
  }
}

/**
 * Get a user by name (case-insensitive search)
 */
export async function getUserByName(name: string): Promise<UserDoc | null> {
  const db = getFirebaseDb()

  try {
    const usersSnap = await getDocs(collection(db, USERS_COLLECTION))
    const user = usersSnap.docs.find(d => 
      d.data().name.toLowerCase() === name.toLowerCase()
    )

    if (!user) {
      return null
    }

    return user.data() as UserDoc
  } catch (error) {
    console.error('Error getting user by name:', error)
    throw error
  }
}

/**
 * Create a new user
 */
export async function createUser(name: string, email?: string): Promise<UserDoc> {
  const db = getFirebaseDb()

  try {
    // Check if user with this name already exists
    const existingUser = await getUserByName(name)
    if (existingUser) {
      return existingUser
    }

    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const userDoc: UserDoc = {
      id: userId,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      createdAt: new Date().toISOString(),
    }

    await setDoc(doc(db, USERS_COLLECTION, userId), userDoc)
    return userDoc
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
