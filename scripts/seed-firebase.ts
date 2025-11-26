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
      { id: 'task-4-2', groupId: 'demo-group-4', title: 'Database Schema Design', description: 'Design normalized database schema with proper document structure for Firestore. Define TypeScript interfaces for type safety and establish relationships between collections using document references.', assignedTo: 'demo-member-4-1', status: 'done', estimatedHours: 5, actualHours: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-3', groupId: 'demo-group-4', title: 'Context API Migration', description: 'Refactor GroupContext to use async Firebase operations instead of localStorage. Implement real-time listeners for data updates and handle loading/error states properly.', assignedTo: 'demo-member-4-1', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-4', groupId: 'demo-group-4', title: 'Performance Optimization', description: 'Optimize Firestore queries using proper indexing, implement query pagination, and add caching strategies to reduce read operations and improve app responsiveness.', assignedTo: 'demo-member-4-1', status: 'in-progress', estimatedHours: 7, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-5', groupId: 'demo-group-4', title: 'Testing Infrastructure', description: 'Set up comprehensive testing suite with Playwright for E2E tests, Jest for unit tests. Create test scenarios for critical user flows and Firebase operations.', assignedTo: 'demo-member-4-1', status: 'in-progress', estimatedHours: 3, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Research tasks for Arto
      { id: 'task-4-6', groupId: 'demo-group-4', title: 'User Research Interviews', description: 'Conduct 10-15 in-depth interviews with university students from different programs about their group work experiences. Focus on pain points, fairness concerns, contribution tracking methods, and conflict resolution. Document findings with quotes and themes.', assignedTo: 'demo-member-4-2', status: 'done', estimatedHours: 8, actualHours: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-7', groupId: 'demo-group-4', title: 'Persona Development', description: 'Create 3-4 detailed user personas representing different student archetypes (e.g., overworked contributor, free-rider, project coordinator). Include goals, frustrations, behaviors, and technology comfort levels.', assignedTo: 'demo-member-4-2', status: 'done', estimatedHours: 5, actualHours: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-8', groupId: 'demo-group-4', title: 'Journey Mapping', description: 'Create comprehensive journey map showing student experience from group formation through project completion. Identify touchpoints, emotions, pain points, and opportunities for intervention at each stage.', assignedTo: 'demo-member-4-2', status: 'in-progress', estimatedHours: 6, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Design tasks for Eva
      { id: 'task-4-9', groupId: 'demo-group-4', title: 'Design System Creation', description: 'Develop comprehensive design system including color palette (primary, secondary, semantic colors), typography scale, spacing system, and component library. Create Figma library with reusable components following atomic design principles.', assignedTo: 'demo-member-4-3', status: 'done', estimatedHours: 7, actualHours: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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
      { id: 'task-4-11', groupId: 'demo-group-4', title: 'High-Fidelity Mockups', description: 'Design pixel-perfect UI mockups in Figma applying the design system. Include light/dark mode variants, responsive layouts for mobile/tablet/desktop, and interactive prototype with micro-interactions.', assignedTo: 'demo-member-4-3', status: 'in-progress', estimatedHours: 10, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Strategy tasks for Getter (Sherpa)
      { id: 'task-4-12', groupId: 'demo-group-4', title: 'Competitive Analysis', description: 'Analyze 5-7 competing tools (Trello, Asana, Monday.com, Notion) focusing on task assignment, time tracking, and fairness features. Create comparison matrix with strengths, weaknesses, and differentiation opportunities.', assignedTo: 'demo-member-4-4', status: 'done', estimatedHours: 6, actualHours: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-13', groupId: 'demo-group-4', title: 'Feature Prioritization', description: 'Facilitate prioritization workshop using MoSCoW method (Must have, Should have, Could have, Won\'t have). Create roadmap for MVP and future releases based on user value and development effort.', assignedTo: 'demo-member-4-4', status: 'done', estimatedHours: 4, actualHours: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'task-4-14', groupId: 'demo-group-4', title: 'Usability Testing Plan', description: 'Design comprehensive usability testing protocol with 5-6 key scenarios covering task creation, assignment, and contribution tracking. Prepare screening questionnaire, test scripts, and success metrics.', assignedTo: 'demo-member-4-4', status: 'in-progress', estimatedHours: 5, actualHours: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Documentation tasks for Jarmo
      { id: 'task-4-15', groupId: 'demo-group-4', title: 'Project Documentation', description: 'Create comprehensive documentation covering design thinking process, research findings, design decisions with rationale, technical architecture, and lessons learned. Include diagrams, screenshots, and data visualizations.', assignedTo: 'demo-member-4-5', status: 'done', estimatedHours: 7, actualHours: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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
