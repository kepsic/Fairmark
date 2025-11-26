import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize Firebase Admin SDK
const serviceAccountPath = join(__dirname, '..', 'fairmark-ed88f-firebase-adminsdk-fbsvc-fef2da4bb1.json')
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  projectId: 'fairmark-ed88f'
})

const db = admin.firestore()

// Demo data
const demoGroups = [
  {
    id: 'demo-group-1',
    name: 'E-Commerce Platform',
    description: 'Building a full-stack online shopping platform with React and Node.js',
    createdAt: new Date().toISOString(),
    members: [
      { id: 'demo-member-1-1', groupId: 'demo-group-1', name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-1-2', groupId: 'demo-group-1', name: 'Bob Smith', email: 'bob.smith@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-1-3', groupId: 'demo-group-1', name: 'Charlie Davis', email: 'charlie.davis@example.com', role: 'member', joinedAt: new Date().toISOString() },
    ],
    tasks: [
      { id: 'task-1-1', groupId: 'demo-group-1', title: 'Database Schema Design', description: 'Design and implement PostgreSQL schema', assignedTo: 'demo-member-1-1', status: 'done', estimatedHours: 8, actualHours: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-2', groupId: 'demo-group-1', title: 'Product Catalog API', description: 'REST API for product CRUD operations', assignedTo: 'demo-member-1-1', status: 'done', estimatedHours: 12, actualHours: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-3', groupId: 'demo-group-1', title: 'Shopping Cart Frontend', description: 'Build cart UI with React', assignedTo: 'demo-member-1-1', status: 'in-progress', estimatedHours: 10, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-4', groupId: 'demo-group-1', title: 'Payment Integration', description: 'Integrate Stripe payment gateway', assignedTo: 'demo-member-1-1', status: 'in-progress', estimatedHours: 8, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-5', groupId: 'demo-group-1', title: 'User Authentication', description: 'Implement JWT-based auth', assignedTo: 'demo-member-1-1', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-6', groupId: 'demo-group-1', title: 'Product Search', description: 'Elasticsearch integration for product search', assignedTo: 'demo-member-1-2', status: 'done', estimatedHours: 5, actualHours: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-7', groupId: 'demo-group-1', title: 'Order History Page', description: 'Display user order history', assignedTo: 'demo-member-1-2', status: 'todo', estimatedHours: 4, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-8', groupId: 'demo-group-1', title: 'Admin Dashboard', description: 'Build admin panel for product management', assignedTo: 'demo-member-1-3', status: 'todo', estimatedHours: 6, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-9', groupId: 'demo-group-1', title: 'Email Notifications', description: 'Order confirmation emails', assignedTo: null, status: 'todo', estimatedHours: 3, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-1-10', groupId: 'demo-group-1', title: 'Testing Suite', description: 'Unit and integration tests', assignedTo: null, status: 'todo', estimatedHours: 8, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]
  },
  {
    id: 'demo-group-2',
    name: 'Mobile Fitness App',
    description: 'Cross-platform fitness tracking application with workout plans and nutrition',
    createdAt: new Date().toISOString(),
    members: [
      { id: 'demo-member-2-1', groupId: 'demo-group-2', name: 'Diana Martinez', email: 'diana.martinez@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-2-2', groupId: 'demo-group-2', name: 'Ethan Wilson', email: 'ethan.wilson@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-2-3', groupId: 'demo-group-2', name: 'Fiona Taylor', email: 'fiona.taylor@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-2-4', groupId: 'demo-group-2', name: 'George Lee', email: 'george.lee@example.com', role: 'member', joinedAt: new Date().toISOString() },
    ],
    tasks: [
      { id: 'task-2-1', groupId: 'demo-group-2', title: 'Workout Library UI', description: 'Design and build exercise catalog', assignedTo: 'demo-member-2-1', status: 'done', estimatedHours: 10, actualHours: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-2', groupId: 'demo-group-2', title: 'Progress Tracking', description: 'Charts and graphs for user progress', assignedTo: 'demo-member-2-1', status: 'done', estimatedHours: 8, actualHours: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-3', groupId: 'demo-group-2', title: 'Nutrition Calculator', description: 'Calorie and macro tracking', assignedTo: 'demo-member-2-1', status: 'in-progress', estimatedHours: 7, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-4', groupId: 'demo-group-2', title: 'User Profile System', description: 'Profile management and settings', assignedTo: 'demo-member-2-2', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-5', groupId: 'demo-group-2', title: 'Workout Plans API', description: 'Backend for custom workout plans', assignedTo: 'demo-member-2-2', status: 'done', estimatedHours: 9, actualHours: 9, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-6', groupId: 'demo-group-2', title: 'Social Features', description: 'Friend system and activity feed', assignedTo: 'demo-member-2-2', status: 'in-progress', estimatedHours: 8, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-7', groupId: 'demo-group-2', title: 'Push Notifications', description: 'Workout reminders and notifications', assignedTo: 'demo-member-2-3', status: 'done', estimatedHours: 5, actualHours: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-8', groupId: 'demo-group-2', title: 'Video Tutorial Integration', description: 'Embed exercise video guides', assignedTo: 'demo-member-2-3', status: 'todo', estimatedHours: 4, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-9', groupId: 'demo-group-2', title: 'Offline Mode', description: 'Local data sync for offline use', assignedTo: 'demo-member-2-4', status: 'todo', estimatedHours: 6, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-2-10', groupId: 'demo-group-2', title: 'Performance Analytics', description: 'Track workout performance over time', assignedTo: null, status: 'todo', estimatedHours: 5, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]
  },
  {
    id: 'demo-group-3',
    name: 'Smart Home Dashboard',
    description: 'IoT dashboard for controlling and monitoring smart home devices',
    createdAt: new Date().toISOString(),
    members: [
      { id: 'demo-member-3-1', groupId: 'demo-group-3', name: 'Hannah Brown', email: 'hannah.brown@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-3-2', groupId: 'demo-group-3', name: 'Ian Clark', email: 'ian.clark@example.com', role: 'sherpa', joinedAt: new Date().toISOString() },
      { id: 'demo-member-3-3', groupId: 'demo-group-3', name: 'Julia White', email: 'julia.white@example.com', role: 'member', joinedAt: new Date().toISOString() },
    ],
    tasks: [
      { id: 'task-3-1', groupId: 'demo-group-3', title: 'Device Discovery Protocol', description: 'Auto-discover IoT devices on network', assignedTo: 'demo-member-3-1', status: 'done', estimatedHours: 12, actualHours: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-3-2', groupId: 'demo-group-3', title: 'Real-time Dashboard UI', description: 'Live updates for device status', assignedTo: 'demo-member-3-1', status: 'in-progress', estimatedHours: 10, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-3-3', groupId: 'demo-group-3', title: 'Voice Control Integration', description: 'Alexa and Google Assistant support', assignedTo: 'demo-member-3-2', status: 'done', estimatedHours: 8, actualHours: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-3-4', groupId: 'demo-group-3', title: 'Energy Monitoring', description: 'Track power consumption per device', assignedTo: 'demo-member-3-2', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-3-5', groupId: 'demo-group-3', title: 'Automation Rules Engine', description: 'If-this-then-that automation', assignedTo: 'demo-member-3-3', status: 'in-progress', estimatedHours: 9, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-3-6', groupId: 'demo-group-3', title: 'Mobile App', description: 'iOS and Android mobile apps', assignedTo: 'demo-member-3-3', status: 'todo', estimatedHours: 15, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-3-7', groupId: 'demo-group-3', title: 'Security Monitoring', description: 'Camera and sensor integration', assignedTo: null, status: 'todo', estimatedHours: 7, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]
  },
  {
    id: 'demo-group-4',
    name: 'Disainmõtlemine',
    description: 'Design thinking project for group work management system',
    createdAt: new Date().toISOString(),
    members: [
      { id: 'demo-member-4-1', groupId: 'demo-group-4', name: 'Andres', email: 'andres@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-4-2', groupId: 'demo-group-4', name: 'Arto', email: 'arto@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-4-3', groupId: 'demo-group-4', name: 'Eva', email: 'eva@example.com', role: 'member', joinedAt: new Date().toISOString() },
      { id: 'demo-member-4-4', groupId: 'demo-group-4', name: 'Getter', email: 'getter@example.com', role: 'sherpa', joinedAt: new Date().toISOString() },
      { id: 'demo-member-4-5', groupId: 'demo-group-4', name: 'Jarmo', email: 'jarmo@example.com', role: 'member', joinedAt: new Date().toISOString() },
    ],
    tasks: [
      // Technical tasks for Andres
      { id: 'task-4-1', groupId: 'demo-group-4', title: 'RxDB Integration', description: 'Implement RxDB for offline-first data sync', assignedTo: 'demo-member-4-1', status: 'done', estimatedHours: 8, actualHours: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-2', groupId: 'demo-group-4', title: 'Database Schema Design', description: 'Design schema for groups, members, and tasks', assignedTo: 'demo-member-4-1', status: 'done', estimatedHours: 5, actualHours: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-3', groupId: 'demo-group-4', title: 'Context API Migration', description: 'Convert localStorage to RxDB operations', assignedTo: 'demo-member-4-1', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-4', groupId: 'demo-group-4', title: 'Performance Optimization', description: 'Optimize database queries and reactivity', assignedTo: 'demo-member-4-1', status: 'in-progress', estimatedHours: 7, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-5', groupId: 'demo-group-4', title: 'Testing Infrastructure', description: 'Set up E2E tests with Playwright', assignedTo: 'demo-member-4-1', status: 'in-progress', estimatedHours: 3, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Research tasks for Arto
      { id: 'task-4-6', groupId: 'demo-group-4', title: 'User Research Interviews', description: 'Conduct interviews with students about group work challenges', assignedTo: 'demo-member-4-2', status: 'done', estimatedHours: 8, actualHours: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-7', groupId: 'demo-group-4', title: 'Persona Development', description: 'Create user personas based on research findings', assignedTo: 'demo-member-4-2', status: 'done', estimatedHours: 5, actualHours: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-8', groupId: 'demo-group-4', title: 'Journey Mapping', description: 'Map student journey through group project lifecycle', assignedTo: 'demo-member-4-2', status: 'in-progress', estimatedHours: 6, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Design tasks for Eva
      { id: 'task-4-9', groupId: 'demo-group-4', title: 'Design System Creation', description: 'Develop color palette and typography guidelines', assignedTo: 'demo-member-4-3', status: 'done', estimatedHours: 7, actualHours: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-10', groupId: 'demo-group-4', title: 'UI Wireframes', description: 'Create low-fidelity wireframes for key screens', assignedTo: 'demo-member-4-3', status: 'done', estimatedHours: 8, actualHours: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-11', groupId: 'demo-group-4', title: 'High-Fidelity Mockups', description: 'Design final UI mockups in Figma', assignedTo: 'demo-member-4-3', status: 'in-progress', estimatedHours: 10, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Strategy tasks for Getter
      { id: 'task-4-12', groupId: 'demo-group-4', title: 'Competitive Analysis', description: 'Research existing group work management tools', assignedTo: 'demo-member-4-4', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-13', groupId: 'demo-group-4', title: 'Feature Prioritization', description: 'Create feature priority matrix with stakeholders', assignedTo: 'demo-member-4-4', status: 'done', estimatedHours: 4, actualHours: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-14', groupId: 'demo-group-4', title: 'Usability Testing Plan', description: 'Design usability test protocol and scenarios', assignedTo: 'demo-member-4-4', status: 'in-progress', estimatedHours: 5, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Documentation tasks for Jarmo
      { id: 'task-4-15', groupId: 'demo-group-4', title: 'Project Documentation', description: 'Document design decisions and methodology', assignedTo: 'demo-member-4-5', status: 'done', estimatedHours: 7, actualHours: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-16', groupId: 'demo-group-4', title: 'Stakeholder Presentations', description: 'Prepare and deliver progress presentations', assignedTo: 'demo-member-4-5', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-17', groupId: 'demo-group-4', title: 'Final Report Writing', description: 'Write comprehensive project report', assignedTo: 'demo-member-4-5', status: 'in-progress', estimatedHours: 8, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Collaborative tasks
      { id: 'task-4-18', groupId: 'demo-group-4', title: 'Ideation Workshop', description: 'Facilitate brainstorming session for features', assignedTo: null, status: 'todo', estimatedHours: 4, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-19', groupId: 'demo-group-4', title: 'Usability Testing', description: 'Conduct usability tests with real users', assignedTo: null, status: 'todo', estimatedHours: 6, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-20', groupId: 'demo-group-4', title: 'Design Critique Session', description: 'Review designs and provide feedback', assignedTo: null, status: 'todo', estimatedHours: 3, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]
  }
]

async function seedFirebase() {
  console.log('Starting Firebase seed...')

  try {
    const batch = db.batch()
    let operationCount = 0

    for (const group of demoGroups) {
      console.log(`\nSeeding group: ${group.name}`)

      // Add group
      const groupRef = db.collection('groups').doc(group.id)
      batch.set(groupRef, {
        id: group.id,
        name: group.name,
        description: group.description,
        createdAt: group.createdAt,
      })
      operationCount++

      // Add members
      console.log(`  Adding ${group.members.length} members...`)
      for (const member of group.members) {
        const memberRef = db.collection('members').doc(member.id)
        batch.set(memberRef, member)
        operationCount++

        if (operationCount >= 450) {
          console.log(`  Committing batch (${operationCount} operations)...`)
          await batch.commit()
          operationCount = 0
        }
      }

      // Add tasks
      console.log(`  Adding ${group.tasks.length} tasks...`)
      for (const task of group.tasks) {
        const taskRef = db.collection('tasks').doc(task.id)
        batch.set(taskRef, task)
        operationCount++

        if (operationCount >= 450) {
          console.log(`  Committing batch (${operationCount} operations)...`)
          await batch.commit()
          operationCount = 0
        }
      }
    }

    if (operationCount > 0) {
      console.log(`\nCommitting final batch (${operationCount} operations)...`)
      await batch.commit()
    }

    console.log('\n✅ Firebase seed completed successfully!')
    console.log(`   ${demoGroups.length} groups`)
    console.log(`   ${demoGroups.reduce((sum, g) => sum + g.members.length, 0)} members`)
    console.log(`   ${demoGroups.reduce((sum, g) => sum + g.tasks.length, 0)} tasks`)

  } catch (error) {
    console.error('❌ Error seeding Firebase:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

seedFirebase()
