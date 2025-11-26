# Demo Data Overview

## Quick Demo Access

Click **"Load Demo (3 Projects, 4 Users)"** button on the login page to instantly explore the Fairmark POC with realistic data.

## Demo Projects

### 1. E-Commerce Platform (Unbalanced ⚠️)
- **Description:** Full-stack online shopping platform with React and Node.js
- **Total Tasks:** 50
- **Team Members:** 3
  - **Alice Johnson:** 42 hours, 28 tasks (Doing most of the work - 66.7%)
  - **Bob Smith:** 8 hours, 5 tasks
  - **Charlie Davis:** 6 hours, 3 tasks
- **Status:** 🔴 **Unbalanced** - One person carrying the team

### 2. Mobile Fitness App (Slightly Unbalanced ⚡)
- **Description:** Cross-platform fitness tracking with workout plans and nutrition
- **Total Tasks:** 40
- **Team Members:** 4
  - **Alice Johnson:** 25 hours, 18 tasks
  - **Diana Martinez:** 24 hours, 16 tasks
  - **Bob Smith:** 7 hours, 4 tasks
  - **Charlie Davis:** 5 hours, 2 tasks
- **Status:** 🟡 **Slightly Unbalanced** - Two people doing 83% of the work

### 3. AI Chatbot System (Balanced ✅)
- **Description:** Intelligent customer service chatbot using ML and NLP
- **Total Tasks:** 35
- **Team Members:** 3
  - **Diana Martinez:** 22 hours, 14 tasks (38.6%)
  - **Charlie Davis:** 19 hours, 11 tasks (33.3%)
  - **Bob Smith:** 18 hours, 10 tasks (28.1%)
- **Status:** 🟢 **Balanced** - Fair distribution of work

## Demo Users

1. **Alice Johnson** (Default user)
   - Active in: E-Commerce Platform, Mobile Fitness App
   - High contributor in both projects

2. **Bob Smith**
   - Active in: All 3 projects
   - Varied contribution levels across projects

3. **Charlie Davis**
   - Active in: E-Commerce Platform, Mobile Fitness App, AI Chatbot
   - Shows different contribution patterns

4. **Diana Martinez**
   - Active in: Mobile Fitness App, AI Chatbot System
   - Balanced contributor

## Key Demonstrations

### Fairness Indicators
- **Red Badge:** One member >50% contribution (E-Commerce)
- **Yellow Badge:** Top two >80% contribution (Mobile Fitness)
- **Green Badge:** Even distribution (AI Chatbot)

### Progress Tracking
- E-Commerce: 36/50 tasks (72% complete)
- Mobile Fitness: 40/40 tasks (100% complete)
- AI Chatbot: 35/35 tasks (100% complete)

### Contribution Formula
```
Score = Hours + (Tasks × 0.5)
Percentage = (Member Score / Total Score) × 100
```

**Example (Alice in E-Commerce):**
- Score: 42 + (28 × 0.5) = 56
- Total: 84 points
- Alice: 66.7%

## Use Cases Demonstrated

1. **Identifying Free Riders:** E-Commerce Platform shows one person doing minimal work
2. **Preventing Burnout:** Unbalanced workload visible at a glance
3. **Fair Grading:** Professors can use contribution % for individual grades
4. **Team Communication:** Visual feedback encourages discussion about work distribution
5. **Project Progress:** Real-time tracking against goals

## Testing the Demo

1. Click "Load Demo" on login page
2. Browse all 3 projects from the groups list
3. View each project's dashboard to see:
   - Fairness badges (red/yellow/green)
   - Progress bars
   - Contribution tables with percentages
4. Try adding work contributions
5. Try adding new members
6. Adjust project settings

## Resetting Demo Data

Simply refresh the page and click "Load Demo" again, or clear localStorage in browser DevTools.
