# Fairmark - Fair Group Work Tracker

A Next.js 14 prototype application for tracking university group project contributions and ensuring fairness.

## Features

### Core Features
- ✅ Simple user identification (localStorage-based)
- ✅ Create and join groups
- ✅ Track hours worked and tasks completed
- ✅ Real-time contribution calculations
- ✅ Fairness indicators (Balanced/Slightly Unbalanced/Unbalanced)
- ✅ Progress tracking for project completion
- ✅ Mobile-first responsive design

### Task Management System
- ✅ Create and assign project tasks
- ✅ Track task status (To Do / In Progress / Done)
- ✅ Auto-assign unassigned tasks evenly across team
- ✅ Task-based contribution tracking
- ✅ Hybrid fairness calculation (task hours + manual contributions)

### Role System
- ✅ Member role: Regular team contributors
- ✅ Sherpa role: Team coordinators focused on project management

### Teacher Dashboard
- ✅ View all projects across classes
- ✅ Detailed project analysis with fairness warnings
- ✅ Visual contribution graphs
- ✅ Automated grading recommendations
- ✅ Identify overworked and undercontributing students

### Canvas LMS Integration (Mock)
- ✅ Load predefined project demonstrating fairness issues
- ✅ Shows realistic unfair distribution scenario

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context + localStorage
- **Testing:** Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation & Running

Using Make commands:

```bash
# Install dependencies
make install

# Start development server
make dev

# Run tests
make test

# Build for production
make build

# Start production server
make start

# Clean project
make clean
```

Or using npm directly:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🎯 Quick Demo

On the login page, click **"Load Demo (3 Projects, 4 Users)"** to instantly explore the POC with realistic data demonstrating:
- ✅ **Balanced team** (AI Chatbot System)
- ⚡ **Slightly unbalanced team** (Mobile Fitness App)  
- ⚠️ **Unbalanced team** (E-Commerce Platform)

See [DEMO.md](./DEMO.md) for detailed demo data overview.

## Project Structure

```plaintext
├── app/                      # Next.js 14 app directory
│   ├── group/[id]/          # Dynamic group pages
│   │   ├── page.tsx         # Group dashboard with task management
│   │   ├── contribute/      # Log manual contributions
│   │   ├── add-member/      # Add team members
│   │   ├── settings/        # Group settings
│   │   └── tasks/           # Task management
│   │       ├── new/         # Create new task
│   │       └── [taskId]/    # Task detail and assignment
│   ├── groups/              # Groups management
│   │   ├── page.tsx         # Groups list
│   │   ├── new/             # Create group
│   │   └── join/            # Join group
│   ├── teacher/             # Teacher views
│   │   ├── projects/        # All projects overview
│   │   └── project/[id]/    # Individual project analysis
│   └── login/               # User login
├── components/              # Reusable components
│   ├── ProgressBar.tsx
│   ├── ContributionTable.tsx
│   ├── ContributionGraph.tsx
│   ├── FairnessBadge.tsx
│   ├── TaskTable.tsx
│   └── GroupCard.tsx
├── context/                 # React Context
│   └── GroupContext.tsx     # State management
├── lib/                     # Utilities
│   ├── fairness.ts         # Fairness calculation algorithms
│   └── validation.ts       # Input validation
└── __tests__/              # Test files
```

## How It Works

### localStorage State

The app stores all data in the browser's localStorage:

- `currentUserName`: Current logged-in user's name
- `fairGroupworkGroups`: Array of all groups with members and contributions

### Contribution Formula

The system uses a hybrid approach combining task-based and manual contributions:

```plaintext
Task Hours = Sum of hours from assigned tasks
Manual Contribution = Manual Hours + (Manual Tasks × 0.5)
Total Effort = Task Hours + Manual Contribution
Percentage = (Member Total Effort / Team Total Effort) × 100
```

### Fairness Rules

- **Unbalanced** (Red): One member >50% OR top two >90%
- **Slightly Unbalanced** (Yellow): One member 40-50% OR top two 80-90%
- **Balanced** (Green): Fair distribution with no single member >40%

### Auto-Assignment Algorithm

When you click "Auto-Assign Tasks":

1. Identifies all unassigned tasks
2. Excludes Sherpa role members (coordinators, not task workers)
3. Calculates current workload for each eligible member
4. Assigns tasks to members with least current workload
5. Rebalances after each assignment for fair distribution

## Teacher View

Teachers can access special views to monitor all projects:

- **Projects List** (`/teacher/projects`): Overview of all projects with fairness warnings
- **Project Detail** (`/teacher/project/[id]`): Deep analysis including:
  - Visual contribution graphs
  - Fairness alerts for imbalanced teams
  - Automated grading recommendations
  - Task completion tracking

See [TEACHER_GUIDE.md](./TEACHER_GUIDE.md) for detailed teacher instructions.

## Testing

Run the test suite:

```bash
make test
```

Test coverage includes:
- GroupContext state management
- All UI components
- Contribution calculations
- Fairness indicators

## Development

```bash
# Start dev server with hot reload
make dev

# Run tests in watch mode
npm run test:watch

# Check for linting issues
npm run lint
```

## License

MIT
