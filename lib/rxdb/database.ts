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

  try {
    const db = await createRxDatabase<FairGroupworkDatabase>({
      name: 'fairgroupwork',
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageDexie(),
      }),
      multiInstance: true,
      eventReduce: true,
      ignoreDuplicate: true, // Ignore if database already exists
    })

    console.log('RxDB database created')

    return await setupCollections(db)
  } catch (error: any) {
    // If there's a schema error, remove old database and recreate
    if (error?.code === 'SC34' || error?.message?.includes('schema')) {
      console.warn('Schema error detected, removing old database and recreating...')
      try {
        await removeDatabase()
        // Recursively call to create fresh database
        return await createDatabase()
      } catch (e) {
        console.error('Failed to recreate database:', e)
        throw e
      }
    }
    throw error
  }
}

async function setupCollections(db: FairGroupworkDatabase): Promise<FairGroupworkDatabase> {
  try {
    // Add collections with migration strategies
    await db.addCollections({
      groups: {
        schema: groupSchema,
        migrationStrategies: {
          // Migrate from version 0 to 1 (just returns the document unchanged, as we only added maxLength)
          1: function(oldDoc: any) {
            return oldDoc;
          }
        }
      },
      members: {
        schema: memberSchema,
        migrationStrategies: {
          1: function(oldDoc: any) {
            return oldDoc;
          }
        }
      },
      tasks: {
        schema: taskSchema,
        migrationStrategies: {
          1: function(oldDoc: any) {
            return oldDoc;
          }
        }
      },
    })

    console.log('Collections added')

    return db
  } catch (error: any) {
    console.error('Error adding collections:', error)
    // If collections fail to add, remove database and let caller retry
    await db.remove()
    throw error
  }
}

// Group schema
const groupSchema = {
  version: 1,
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
      maxLength: 50, // ISO date strings are ~24 chars, 50 is safe
    },
  },
  required: ['id', 'name', 'description', 'createdAt'],
  indexes: ['createdAt'],
}

// Member schema
const memberSchema = {
  version: 1,
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
      maxLength: 100,
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
      maxLength: 100,
    },
    role: {
      type: 'string',
      enum: ['member', 'sherpa'],
    },
    joinedAt: {
      type: 'string',
      format: 'date-time',
      maxLength: 50,
    },
  },
  required: ['id', 'groupId', 'name', 'email', 'role', 'joinedAt'],
  indexes: ['groupId', 'email'],
}

// Task schema
const taskSchema = {
  version: 1,
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
      maxLength: 100,
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    assignedTo: {
      type: ['string', 'null'],
      maxLength: 100,
    },
    status: {
      type: 'string',
      enum: ['todo', 'in-progress', 'done'],
      maxLength: 20,
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
      maxLength: 50,
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      maxLength: 50,
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
    try {
      const db = await dbPromise
      await db.remove()
    } catch (e) {
      console.warn('Error removing database:', e)
    }
    dbPromise = null
  }

  // Also clear IndexedDB directly as fallback
  if (typeof window !== 'undefined' && window.indexedDB) {
    try {
      await new Promise<void>((resolve, reject) => {
        const request = window.indexedDB.deleteDatabase('fairgroupwork')
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
        request.onblocked = () => {
          console.warn('Database deletion blocked')
          resolve() // Don't fail, just continue
        }
      })
    } catch (e) {
      console.warn('Error deleting IndexedDB:', e)
    }
  }
}
