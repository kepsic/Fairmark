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
      { 
        id: 'task-4-1', 
        groupId: 'demo-group-4', 
        title: 'Firebase Migration', 
        description: 'Migrate from RxDB to Firebase Firestore for cloud-based real-time data synchronization. Implement Firestore SDK, set up collections for groups/members/tasks, and configure security rules.', 
        assignedTo: 'demo-member-4-1', 
        status: 'done', 
        estimatedHours: 8, 
        actualHours: 8, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Andres',
            content: 'Set up Firebase project in console. Created firestore database and configured authentication. Generated service account key for admin SDK.\n\nImplementation:\n- Installed firebase and firebase-admin packages\n- Created lib/firebase/config.ts for initialization\n- Added environment variables to .env.local\n\nNo blockers so far.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-2',
            author: 'Andres',
            content: 'Created Firestore collections structure:\n- groups (id, name, description, createdAt)\n- members (id, groupId, name, email, role, joinedAt)\n- tasks (id, groupId, title, description, assignedTo, status, estimatedHours, actualHours)\n\nSet up TypeScript types in lib/firebase/types.ts. All properly typed with interfaces.\n\nChallenge: Decided on denormalized structure vs. subcollections. Went with top-level collections for easier querying.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 3
          },
          {
            id: 'log-3',
            author: 'Andres',
            content: 'Implemented CRUD operations in lib/firebase/operations.ts:\n✅ getAllGroups() with members and tasks\n✅ getGroupById()\n✅ createGroup(), updateGroup(), deleteGroup()\n✅ createTask(), updateTask(), deleteTask()\n✅ Bulk insert for demo data seeding\n\nAll operations use proper error handling and TypeScript types.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2.5
          },
          {
            id: 'log-4',
            author: 'Andres',
            content: 'Configured Firestore security rules:\n- Read/write access for authenticated users\n- Document-level rules for data validation\n- Rate limiting considerations\n\nTested all operations with seed data. Migration complete and working! 🎉\n\nNext: Update GroupContext to use Firebase operations instead of localStorage.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 0.5
          }
        ]
      },
      { 
        id: 'task-4-2', 
        groupId: 'demo-group-4', 
        title: 'Database Schema Design', 
        description: 'Design normalized database schema with proper document structure for Firestore. Define TypeScript interfaces for type safety and establish relationships between collections using document references.', 
        assignedTo: 'demo-member-4-1', 
        status: 'done', 
        estimatedHours: 5, 
        actualHours: 5, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Andres',
            content: 'Started schema design by listing all entities and their attributes:\n- Groups (name, description, timestamps)\n- Members (name, email, role, joinedAt)\n- Tasks (title, description, status, hours, assignedTo)\n\nResearching Firestore best practices for document relationships.',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 1.5
          },
          {
            id: 'log-2',
            author: 'Andres',
            content: 'Decided on top-level collections vs subcollections:\n✅ Top-level: groups, members, tasks\n❌ Not using: groups/{id}/members subcollections\n\nReason: Easier querying across all members/tasks. Trade-off: Need to manually maintain groupId references.\n\nCreated TypeScript interfaces in types.ts with proper typing.',
            createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-3',
            author: 'Andres',
            content: 'Added indexes for common queries:\n- members: groupId\n- tasks: groupId, assignedTo, status\n\nDocumented schema in README with ER diagram. Reviewed with team - everyone approved the structure.',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 1.5
          }
        ]
      },
      { id: 'task-4-3', groupId: 'demo-group-4', title: 'Context API Migration', description: 'Refactor GroupContext to use async Firebase operations instead of localStorage. Implement real-time listeners for data updates and handle loading/error states properly.', assignedTo: 'demo-member-4-1', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { 
        id: 'task-4-4', 
        groupId: 'demo-group-4', 
        title: 'Performance Optimization', 
        description: 'Optimize Firestore queries using proper indexing, implement query pagination, and add caching strategies to reduce read operations and improve app responsiveness.', 
        assignedTo: 'demo-member-4-1', 
        status: 'in-progress', 
        estimatedHours: 7, 
        actualHours: 0, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Andres',
            content: 'Started performance audit using Chrome DevTools and React Profiler:\n\n🐌 Issues found:\n- Re-rendering entire task list on every update\n- Fetching all group data on every page load\n- No memoization of expensive computations\n\nPlan: Add React.memo, useMemo, useCallback where needed. Implement incremental loading for large task lists.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-2',
            author: 'Andres',
            content: 'Added Firestore composite indexes for common query patterns:\n- tasks: [groupId, status, createdAt]\n- members: [groupId, role]\n\nImplemented query result caching with 5-minute TTL in GroupContext. Reduced reads by ~60% in testing.\n\nNext: Add pagination for projects with 50+ tasks.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 3
          }
        ]
      },
      { id: 'task-4-5', groupId: 'demo-group-4', title: 'Testing Infrastructure', description: 'Set up comprehensive testing suite with Playwright for E2E tests, Jest for unit tests. Create test scenarios for critical user flows and Firebase operations.', assignedTo: 'demo-member-4-1', status: 'in-progress', estimatedHours: 3, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Research tasks for Arto
      { 
        id: 'task-4-6', 
        groupId: 'demo-group-4', 
        title: 'User Research Interviews', 
        description: 'Conduct 10-15 in-depth interviews with university students from different programs about their group work experiences. Focus on pain points, fairness concerns, contribution tracking methods, and conflict resolution. Document findings with quotes and themes.', 
        assignedTo: 'demo-member-4-2', 
        status: 'done', 
        estimatedHours: 8, 
        actualHours: 8, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Arto',
            content: 'Prepared interview guide with 15 open-ended questions covering:\n- Past group work experiences (positive/negative)\n- How groups divide work\n- Tracking contributions\n- Handling free-riders\n- Fairness concerns\n\nRecruited 12 students from CS, Business, Design programs via university Discord.',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-2',
            author: 'Arto',
            content: 'Completed 6 interviews today (30-45 min each). Key themes emerging:\n\n😫 "We never know who did what until it\'s too late"\n🤝 Most groups use informal tracking (group chats, memory)\n⚖️ Strong desire for transparency without creating conflict\n\nRecording and transcribing for analysis.',
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 3.5
          },
          {
            id: 'log-3',
            author: 'Arto',
            content: 'Finished remaining 6 interviews. Used affinity mapping to cluster insights:\n\n📊 Top pain points:\n1. Unequal workload (mentioned by 11/12)\n2. Lack of visibility into progress\n3. Awkward conversations about fairness\n4. Last-minute surprises\n\nQuote: "I wish there was a simple way to show everyone\'s effort without feeling like we\'re being monitored."',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2.5
          }
        ]
      },
      { 
        id: 'task-4-7', 
        groupId: 'demo-group-4', 
        title: 'Persona Development', 
        description: 'Create 3-4 detailed user personas representing different student archetypes (e.g., overworked contributor, free-rider, project coordinator). Include goals, frustrations, behaviors, and technology comfort levels.', 
        assignedTo: 'demo-member-4-2', 
        status: 'done', 
        estimatedHours: 5, 
        actualHours: 5, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Arto',
            content: 'Analyzed interview transcripts and identified 4 distinct behavioral patterns:\n\n1. The Overachiever (does most work, frustrated by freeloaders)\n2. The Coordinator (manages team, stressed about fairness)\n3. The Passive Participant (contributes minimally, avoids conflict)\n4. The Balanced Contributor (wants fair distribution)\n\nStarted persona template with demographics, goals, frustrations, tech usage.',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-2',
            author: 'Arto',
            content: 'Created detailed persona cards with photos, quotes, and day-in-life scenarios:\n\n👤 Sarah (The Coordinator): CS major, organizes everything, needs visibility\n👤 Mike (The Overachiever): Perfectionist, takes on extra work, resents unfairness\n👤 Lisa (Balanced Contributor): Design student, wants transparency\n👤 Tom (Passive): Business major, contributes when asked\n\nUsed Figma for visual persona boards.',
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 3
          }
        ]
      },
      { 
        id: 'task-4-8', 
        groupId: 'demo-group-4', 
        title: 'Journey Mapping', 
        description: 'Create comprehensive journey map showing student experience from group formation through project completion. Identify touchpoints, emotions, pain points, and opportunities for intervention at each stage.', 
        assignedTo: 'demo-member-4-2', 
        status: 'in-progress', 
        estimatedHours: 6, 
        actualHours: 0, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Arto',
            content: 'Identified 7 key stages in student group work journey:\n\n1️⃣ Group Formation (anxiety, uncertainty)\n2️⃣ Initial Planning (hope, excitement)\n3️⃣ Task Distribution (negotiation, concerns)\n4️⃣ Execution (varying emotions)\n5️⃣ Check-ins (relief or stress)\n6️⃣ Final Push (panic or confidence)\n7️⃣ Submission (exhaustion, reflection)\n\nMapping touchpoints and pain points for each stage.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2.5
          },
          {
            id: 'log-2',
            author: 'Arto',
            content: 'Created visual journey map in Miro with swim lanes:\n- Actions taken\n- Emotions felt (emoji scale)\n- Pain points (red flags)\n- Opportunities (green highlights)\n\nStarting to identify where Fairmark can intervene. Stage 3 (Task Distribution) and 4 (Execution) are critical.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          }
        ]
      },

      // Design tasks for Eva
      { 
        id: 'task-4-9', 
        groupId: 'demo-group-4', 
        title: 'Design System Creation', 
        description: 'Develop comprehensive design system including color palette (primary, secondary, semantic colors), typography scale, spacing system, and component library. Create Figma library with reusable components following atomic design principles.', 
        assignedTo: 'demo-member-4-3', 
        status: 'done', 
        estimatedHours: 7, 
        actualHours: 7, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Eva',
            content: 'Research phase: Analyzed competitor design systems (Material Design, Ant Design, Atlassian).\n\nColor palette decisions:\n🔵 Primary: #003A79 (trust, stability)\n🟡 Accent: #D4A017 (energy, action)\n⚪ Neutrals: Gray scale for text/backgrounds\n🟢 Success, 🔴 Error, 🟡 Warning semantic colors\n\nEnsured WCAG AA accessibility for all combinations.',
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2.5
          },
          {
            id: 'log-2',
            author: 'Eva',
            content: 'Typography system:\n- Primary font: Inter (clean, professional, open-source)\n- Scale: 12px, 14px, 16px, 20px, 24px, 32px, 48px\n- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)\n\nSpacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64px)\n\nDocumented usage guidelines for each size.',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-3',
            author: 'Eva',
            content: 'Built atomic component library in Figma:\n\n⚛️ Atoms: Buttons, inputs, badges, icons\n🧩 Molecules: Form fields, cards, list items\n📦 Organisms: Navigation bar, task table, contribution graph\n\nAll components have variants for states (default, hover, active, disabled).\n\nCreated documentation page with usage examples.',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2.5
          }
        ]
      },
      { 
        id: 'task-4-10', 
        groupId: 'demo-group-4', 
        title: 'UI Wireframes', 
        description: 'Create low-fidelity wireframes for all key screens: dashboard, project creation, task assignment, member management, and contribution tracking. Focus on information architecture and user flow without detailed visual design.', 
        assignedTo: 'demo-member-4-3', 
        status: 'done', 
        estimatedHours: 8, 
        actualHours: 8, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Eva',
            content: 'Started with user flow mapping. Created flows for:\n- New user onboarding\n- Creating a new project\n- Adding tasks and assigning to members\n- Viewing contribution dashboard\n\nUsed Figma FigJam for the flow diagrams.',
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-2',
            author: 'Eva',
            content: 'Completed wireframes for main screens:\n✅ Landing page\n✅ Login/signup\n✅ Project list dashboard\n✅ Project detail view\n✅ Task creation form\n\nFocused on mobile-first approach. All wireframes are lo-fi grayscale boxes and text.',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 3
          },
          {
            id: 'log-3',
            author: 'Eva',
            content: 'Created wireframes for member management and contribution tracking:\n- Member list with hours worked\n- Task assignment interface\n- Fairness visualization (chart wireframe)\n- Sherpa role indicators\n\nGot feedback from Getter on information hierarchy. Will adjust spacing in next iteration.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2.5
          },
          {
            id: 'log-4',
            author: 'Eva',
            content: 'Final review and refinements:\n- Added annotations for interactions (click, hover states)\n- Created component library in Figma for reusable elements\n- Documented responsive breakpoints\n- Shared with team for review\n\nAll 15 core screens are complete. Ready to move to high-fidelity mockups!',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 0.5
          }
        ]
      },
      { 
        id: 'task-4-11', 
        groupId: 'demo-group-4', 
        title: 'High-Fidelity Mockups', 
        description: 'Design pixel-perfect UI mockups in Figma applying the design system. Include light/dark mode variants, responsive layouts for mobile/tablet/desktop, and interactive prototype with micro-interactions.', 
        assignedTo: 'demo-member-4-3', 
        status: 'in-progress', 
        estimatedHours: 10, 
        actualHours: 0, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Eva',
            content: 'Started high-fidelity designs for core screens using the design system:\n\n✅ Login page (clean, simple)\n✅ Project dashboard (cards layout, progress bars)\n✅ Task detail page (work log timeline)\n\nApplying colors, typography, spacing from design system. Everything is crisp at all zoom levels.',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 3.5
          },
          {
            id: 'log-2',
            author: 'Eva',
            content: 'Working on contribution visualization screens:\n- Pie chart for work distribution\n- Bar chart for hours comparison\n- Fairness badge with emoji indicators\n\nAdded hover states and tooltips. Need to finish mobile responsive variants and then start on interactive prototype.',
            createdAt: new Date().toISOString(),
            hoursSpent: 2.5
          }
        ]
      },

      // Strategy tasks for Getter (Sherpa)
      { 
        id: 'task-4-12', 
        groupId: 'demo-group-4', 
        title: 'Competitive Analysis', 
        description: 'Analyze 5-7 competing tools (Trello, Asana, Monday.com, Notion) focusing on task assignment, time tracking, and fairness features. Create comparison matrix with strengths, weaknesses, and differentiation opportunities.', 
        assignedTo: 'demo-member-4-4', 
        status: 'done', 
        estimatedHours: 6, 
        actualHours: 6, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Getter',
            content: 'Identified competitors and created trial accounts:\n✅ Trello (simple, visual, limited time tracking)\n✅ Asana (robust, enterprise, complex for students)\n✅ Monday.com (powerful, expensive)\n✅ Notion (flexible, steep learning curve)\n✅ ClickUp (feature-rich, overwhelming)\n\nTesting each with a mock student project scenario.',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-2',
            author: 'Getter',
            content: 'Key findings:\n\n🚫 NONE have fairness-focused features\n⏱️ Time tracking exists but not contribution comparison\n👥 No built-in "sherpa" or mentor roles\n💰 Most require paid plans for full features\n\n🎯 Our differentiation: Focus on equity, transparency, and student affordability.',
            createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2.5
          },
          {
            id: 'log-3',
            author: 'Getter',
            content: 'Created comparison matrix spreadsheet with 20+ criteria:\n- Task management (all strong)\n- Time tracking (limited)\n- Fairness metrics (NONE)\n- Price (high for students)\n- Learning curve (varies)\n\nPresented findings to team. Validated our unique value proposition around fairness and contribution visibility.',
            createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 1.5
          }
        ]
      },
      { id: 'task-4-13', groupId: 'demo-group-4', title: 'Feature Prioritization', description: 'Facilitate prioritization workshop using MoSCoW method (Must have, Should have, Could have, Won\'t have). Create roadmap for MVP and future releases based on user value and development effort.', assignedTo: 'demo-member-4-4', status: 'done', estimatedHours: 4, actualHours: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-14', groupId: 'demo-group-4', title: 'Usability Testing Plan', description: 'Design comprehensive usability testing protocol with 5-6 key scenarios covering task creation, assignment, and contribution tracking. Prepare screening questionnaire, test scripts, and success metrics.', assignedTo: 'demo-member-4-4', status: 'in-progress', estimatedHours: 5, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Documentation tasks for Jarmo
      { 
        id: 'task-4-15', 
        groupId: 'demo-group-4', 
        title: 'Project Documentation', 
        description: 'Create comprehensive documentation covering design thinking process, research findings, design decisions with rationale, technical architecture, and lessons learned. Include diagrams, screenshots, and data visualizations.', 
        assignedTo: 'demo-member-4-5', 
        status: 'done', 
        estimatedHours: 7, 
        actualHours: 7, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        workLogs: [
          {
            id: 'log-1',
            author: 'Jarmo',
            content: 'Set up documentation structure in Notion:\n\n📁 1. Project Overview\n📁 2. Research & Discovery\n📁 3. Design Process\n📁 4. Technical Implementation\n📁 5. Testing & Iteration\n📁 6. Lessons Learned\n\nGathered materials from all team members - interviews, designs, code docs.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 1.5
          },
          {
            id: 'log-2',
            author: 'Jarmo',
            content: 'Documented research phase:\n- Synthesized Arto\'s interview findings into key insights\n- Created visual personas gallery\n- Mapped journey from Arto\'s work\n- Added competitive analysis matrix from Getter\n\nUsed charts and infographics to make data scannable.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2.5
          },
          {
            id: 'log-3',
            author: 'Jarmo',
            content: 'Technical documentation:\n- Andres provided architecture diagrams (Firebase, Next.js stack)\n- Documented data model with ER diagrams\n- Added code snippets for key features\n- Created deployment guide for Vercel\n\nEva\'s design system documented with component examples.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 2
          },
          {
            id: 'log-4',
            author: 'Jarmo',
            content: 'Final polish:\n✅ Added table of contents with anchors\n✅ Embedded Figma prototypes\n✅ Screenshots of all major features\n✅ Lessons learned section (what worked, what didn\'t)\n✅ Team reflection quotes\n\nShared with team for review. Documentation complete!',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSpent: 1
          }
        ]
      },
      { id: 'task-4-16', groupId: 'demo-group-4', title: 'Stakeholder Presentations', description: 'Design and deliver bi-weekly progress presentations to course instructors and peers. Include demo videos, user feedback highlights, metrics, and next steps. Create visually engaging slides with clear narrative.', assignedTo: 'demo-member-4-5', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-17', groupId: 'demo-group-4', title: 'Final Report Writing', description: 'Write 25-30 page academic report following design thinking methodology. Cover problem definition, research phase, ideation, prototyping, testing, and final solution. Include appendices with raw data, interview transcripts, and test results.', assignedTo: 'demo-member-4-5', status: 'in-progress', estimatedHours: 8, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Collaborative tasks
      { id: 'task-4-18', groupId: 'demo-group-4', title: 'Ideation Workshop', description: 'Run collaborative ideation workshop using design thinking techniques (brainstorming, crazy 8s, affinity mapping). Generate 50+ feature ideas, cluster into themes, and vote on top concepts to prototype.', assignedTo: null, status: 'todo', estimatedHours: 4, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-19', groupId: 'demo-group-4', title: 'Usability Testing', description: 'Conduct moderated usability testing sessions with 8-10 university students. Test key workflows, measure task completion rates and time-on-task, collect qualitative feedback using think-aloud protocol. Synthesize findings into actionable recommendations.', assignedTo: null, status: 'todo', estimatedHours: 6, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-20', groupId: 'demo-group-4', title: 'Design Critique Session', description: 'Facilitate structured design critique following established frameworks. Present design rationale, gather constructive feedback from team and external reviewers, document suggestions, and prioritize improvements for next iteration.', assignedTo: null, status: 'todo', estimatedHours: 3, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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
