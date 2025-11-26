import { getDatabase } from './database'
import type { Group, Member, Task, GroupDocument, MemberDocument, TaskDocument } from './schema'

/**
 * Get all groups with their members and tasks
 */
export async function getAllGroups(): Promise<Group[]> {
  const db = await getDatabase()

  const groups = await db.groups.find().exec()
  const allMembers = await db.members.find().exec()
  const allTasks = await db.tasks.find().exec()

  return groups.map((groupDoc: GroupDocument) => {
    const group = groupDoc.toJSON()
    const members = allMembers
      .filter((m: MemberDocument) => m.groupId === group.id)
      .map((m: MemberDocument) => m.toJSON())
    const tasks = allTasks
      .filter((t: TaskDocument) => t.groupId === group.id)
      .map((t: TaskDocument) => t.toJSON())

    return {
      ...group,
      members,
      tasks,
    }
  })
}

/**
 * Get a single group by ID with its members and tasks
 */
export async function getGroupById(groupId: string): Promise<Group | null> {
  const db = await getDatabase()

  const groupDoc = await db.groups.findOne(groupId).exec()
  if (!groupDoc) return null

  const members = await db.members
    .find({
      selector: { groupId },
    })
    .exec()

  const tasks = await db.tasks
    .find({
      selector: { groupId },
    })
    .exec()

  return {
    ...groupDoc.toJSON(),
    members: members.map((m: MemberDocument) => m.toJSON()),
    tasks: tasks.map((t: TaskDocument) => t.toJSON()),
  }
}

/**
 * Create a new group
 */
export async function createGroup(
  group: Omit<Group, 'members' | 'tasks'>
): Promise<void> {
  const db = await getDatabase()
  await db.groups.insert({
    id: group.id,
    name: group.name,
    description: group.description,
    createdAt: group.createdAt,
  })
}

/**
 * Update a group
 */
export async function updateGroup(
  groupId: string,
  updates: Partial<Pick<Group, 'name' | 'description'>>
): Promise<void> {
  const db = await getDatabase()
  const groupDoc = await db.groups.findOne(groupId).exec()
  if (groupDoc) {
    await groupDoc.patch(updates)
  }
}

/**
 * Delete a group and all its members and tasks
 */
export async function deleteGroup(groupId: string): Promise<void> {
  const db = await getDatabase()

  // Delete all tasks
  const tasks = await db.tasks.find({ selector: { groupId } }).exec()
  await Promise.all(tasks.map((task: TaskDocument) => task.remove()))

  // Delete all members
  const members = await db.members.find({ selector: { groupId } }).exec()
  await Promise.all(members.map((member: MemberDocument) => member.remove()))

  // Delete the group
  const groupDoc = await db.groups.findOne(groupId).exec()
  if (groupDoc) {
    await groupDoc.remove()
  }
}

/**
 * Add a member to a group
 */
export async function addMember(member: Member): Promise<void> {
  const db = await getDatabase()
  await db.members.insert(member)
}

/**
 * Update a member
 */
export async function updateMember(
  memberId: string,
  updates: Partial<Member>
): Promise<void> {
  const db = await getDatabase()
  const memberDoc = await db.members.findOne(memberId).exec()
  if (memberDoc) {
    await memberDoc.patch(updates)
  }
}

/**
 * Remove a member from a group
 */
export async function removeMember(memberId: string): Promise<void> {
  const db = await getDatabase()
  const memberDoc = await db.members.findOne(memberId).exec()
  if (memberDoc) {
    // Unassign any tasks assigned to this member
    const tasks = await db.tasks
      .find({ selector: { assignedTo: memberId } })
      .exec()
    await Promise.all(tasks.map((task: TaskDocument) => task.patch({ assignedTo: null })))

    // Remove the member
    await memberDoc.remove()
  }
}

/**
 * Add a task to a group
 */
export async function addTask(task: Task): Promise<void> {
  const db = await getDatabase()
  await db.tasks.insert(task)
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  const db = await getDatabase()
  const taskDoc = await db.tasks.findOne(taskId).exec()
  if (taskDoc) {
    await taskDoc.patch({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  const db = await getDatabase()
  const taskDoc = await db.tasks.findOne(taskId).exec()
  if (taskDoc) {
    await taskDoc.remove()
  }
}

/**
 * Clear all data (for demo/testing)
 */
export async function clearAllData(): Promise<void> {
  const db = await getDatabase()

  await db.tasks.find().remove()
  await db.members.find().remove()
  await db.groups.find().remove()
}

/**
 * Bulk insert groups with members and tasks
 */
export async function bulkInsertGroups(groups: Group[]): Promise<void> {
  const db = await getDatabase()

  // Clear existing data first
  await clearAllData()

  // Insert groups
  await db.groups.bulkInsert(
    groups.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      createdAt: g.createdAt,
    }))
  )

  // Insert all members
  const allMembers = groups.flatMap((g) => g.members)
  if (allMembers.length > 0) {
    await db.members.bulkInsert(allMembers)
  }

  // Insert all tasks
  const allTasks = groups.flatMap((g) => g.tasks)
  if (allTasks.length > 0) {
    await db.tasks.bulkInsert(allTasks)
  }
}
