import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import type { GroupCollection, MemberCollection, TaskCollection } from './schema'

// Add dev-mode plugin in development
if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

export type FairGroupworkDatabase = RxDatabase<{
  groups: GroupCollection
  members: MemberCollection
  tasks: TaskCollection
}>

let dbPromise: Promise<FairGroupworkDatabase> | null = null

/**
 * Create or get the singleton RxDB database instance
 */
export async function getDatabase(): Promise<FairGroupworkDatabase> {
  if (dbPromise) {
    return dbPromise
  }

  dbPromise = createDatabase()
  return dbPromise
}

async function createDatabase(): Promise<FairGroupworkDatabase> {
  console.log('Creating RxDB database...')

  const db = await createRxDatabase<FairGroupworkDatabase>({
    name: 'fairgroupwork',
    storage: wrappedValidateAjvStorage({
      storage: getRxStorageDexie(),
    }),
    multiInstance: true,
    eventReduce: true,
  })

  console.log('RxDB database created')

  // Add collections
  await db.addCollections({
    groups: {
      schema: groupSchema,
    },
    members: {
      schema: memberSchema,
    },
    tasks: {
      schema: taskSchema,
    },
  })

  console.log('Collections added')

  return db
}

// Group schema
const groupSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'name', 'description', 'createdAt'],
  indexes: ['createdAt'],
}

// Member schema
const memberSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    groupId: {
      type: 'string',
      ref: 'groups',
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    role: {
      type: 'string',
      enum: ['member', 'sherpa'],
    },
    joinedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'groupId', 'name', 'email', 'role', 'joinedAt'],
  indexes: ['groupId', 'email'],
}

// Task schema
const taskSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    groupId: {
      type: 'string',
      ref: 'groups',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    assignedTo: {
      type: ['string', 'null'],
    },
    status: {
      type: 'string',
      enum: ['todo', 'in-progress', 'done'],
    },
    estimatedHours: {
      type: 'number',
    },
    actualHours: {
      type: 'number',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: [
    'id',
    'groupId',
    'title',
    'description',
    'status',
    'estimatedHours',
    'actualHours',
    'createdAt',
    'updatedAt',
  ],
  indexes: ['groupId', 'assignedTo', 'status'],
}

/**
 * Clean up database (for testing or reset)
 */
export async function removeDatabase() {
  if (dbPromise) {
    const db = await dbPromise
    await db.remove()
    dbPromise = null
  }
}
