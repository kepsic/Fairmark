import admin from 'firebase-admin'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize Firebase Admin
const serviceAccount = resolve(__dirname, '../fairmark-ed88f-firebase-adminsdk-fbsvc-fef2da4bb1.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'fairmark-ed88f'
})

const db = admin.firestore()

// Disainmõtlemine contributors
const users = [
  {
    id: 'user-andres',
    name: 'Andres',
    email: 'andres@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-arto',
    name: 'Arto',
    email: 'arto@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-eva',
    name: 'Eva',
    email: 'eva@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-getter',
    name: 'Getter',
    email: 'getter@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-jarmo',
    name: 'Jarmo',
    email: 'jarmo@example.com',
    createdAt: new Date().toISOString()
  }
]

async function seedUsers() {
  console.log('Starting user seed...')

  try {
    const batch = db.batch()

    for (const user of users) {
      console.log(`  Adding user: ${user.name} (${user.email})`)
      const userRef = db.collection('users').doc(user.id)
      batch.set(userRef, user)
    }

    await batch.commit()
    console.log('\n✅ User seed completed successfully!')
    console.log(`   ${users.length} users created`)
    
    // List all users
    console.log('\nCreated users:')
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`)
    })

  } catch (error) {
    console.error('❌ Error seeding users:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

seedUsers()
