# Teacher Guide - Fairmark System

## Overview

Fairmark is a university groupwork fairness and task assignment system designed to help teachers monitor student contributions and identify potential issues in team projects.

## Key Features for Teachers

### 1. Teacher Dashboard

Access the teacher dashboard at `/teacher/projects` to see:
- **Summary Statistics**: Total projects, students, and tasks across all groups
- **All Active Projects**: Complete list of student projects with quick overview
- **Fairness Warnings**: Visual indicators for projects with unbalanced workloads
- **Project Details**: Click any project to dive deeper

### 2. Project Detail View

For each project, you can review:

#### Fairness Analysis
- **Fairness Badge**: Color-coded indicator (Green/Yellow/Red)
  - 🟢 **Green (Balanced)**: Fair distribution of work
  - 🟡 **Yellow (Caution)**: Some imbalance detected
  - 🔴 **Red (Warning)**: Significant imbalance requiring attention

#### Fairness Alerts
When imbalances are detected, the system shows:
- **Overworked Members**: Students doing >50% of the work
- **Undercontributing Members**: Students doing <10% of the work
- Specific percentage breakdowns for each student

#### Visual Contribution Graph
- Horizontal bar chart showing relative contributions
- Color-coded by fairness status
- Shows both task-based and manual hours
- Sherpa roles clearly marked (coordination-focused members)

#### Task Overview
- All project tasks with status indicators
- Assignment information
- Completion tracking
- Hours estimates per task

#### Detailed Contribution Table
Shows for each team member:
- **Task Hours**: Hours from assigned project tasks
- **Manual Hours**: Self-reported hours
- **Manual Tasks**: Number of tasks logged manually
- **Total Contribution**: Combined effort score
- **Percentage**: Share of total project work
- **Role**: Member or Sherpa (coordinator)

#### Grading Recommendations
The system provides automated grade adjustment suggestions:
- **Bonus consideration**: Members contributing >40%
- **Standard grade**: Members with balanced contributions (15-40%)
- **Penalty consideration**: Members contributing <15%

## Understanding the Fairness Algorithm

### How Contributions Are Calculated

```
Task Hours = Sum of hours from assigned tasks
Manual Contribution = Manual Hours + (Manual Tasks × 0.5)
Total Effort = Task Hours + Manual Contribution
Percentage = (Member's Total Effort / Team Total Effort) × 100
```

### Fairness Status Determination

- **Balanced (Green)**: No single member >40%, top two members <80% of total
- **Slightly Unbalanced (Yellow)**: One member 40-50% OR top two 80-90%
- **Unbalanced (Red)**: One member >50% OR top two >90% of total work

## Special Roles

### Sherpa Role
- Designated team coordinators
- Focus on project management and communication
- Not assigned to technical tasks in auto-assignment
- Marked with purple badge throughout the system
- Their coordination work should be considered when grading

## Using the System

### Step 1: Access Teacher View
1. Log in to the system
2. Navigate to `/teacher/projects`
3. View all active projects

### Step 2: Review Project Health
- Look for red or yellow fairness badges
- Check summary statistics
- Identify projects needing intervention

### Step 3: Deep Dive into Problematic Projects
1. Click on a project with fairness warnings
2. Review the contribution graph
3. Examine specific member contributions
4. Check task assignment and completion

### Step 4: Take Action
Based on findings, you can:
- **Intervene early**: Contact teams showing imbalance
- **Adjust grades**: Use grading recommendations as guidance
- **Facilitate discussions**: Help teams redistribute work
- **Monitor progress**: Check back regularly to see improvements

## Best Practices

### Regular Monitoring
- Review projects weekly during active development
- Pay special attention to early signs of imbalance
- Don't wait until project end to intervene

### Consider Context
- Sherpa roles naturally have lower task hours
- Some members may have frontend/backend specializations
- Quality of work matters, not just quantity
- Team dynamics and soft skills are important

### Communication
- Use data as conversation starters, not final judgments
- Discuss findings with project leads first
- Encourage teams to use auto-assignment for fairness
- Promote transparency within teams

### Grading
- Use percentages as one factor among many
- Consider peer evaluations alongside system data
- Account for special circumstances
- Document grade adjustments with specific rationale

## Common Scenarios

### Scenario 1: One Student Doing Everything
**Signs**: One member >60%, others <15% each
**Action**: 
- Meet with the team immediately
- Discuss work distribution
- Set clear expectations for remaining work
- Consider mandatory task reassignment

### Scenario 2: Free Rider
**Signs**: One member <5%, all tasks incomplete or unassigned
**Action**:
- Individual meeting with low-contributing student
- Identify barriers (skills, time, communication)
- Set specific deliverables and deadlines
- Follow up frequently

### Scenario 3: Two-Person Team
**Signs**: Two members >80% combined, rest minimal
**Action**:
- Investigate team dynamics
- Check if roles are clearly defined
- Ensure all members have assigned tasks
- May indicate communication breakdown

### Scenario 4: Declining Contribution
**Signs**: Member's percentage dropping over time
**Action**:
- Early indicator of disengagement
- Check in with student individually
- Identify personal or academic challenges
- Connect to support resources if needed

## Technical Notes

### Data Accuracy
- System relies on student-reported data
- Manual hours and tasks are self-reported
- Task assignments should be kept up to date
- Encourage teams to use the system regularly

### Limitations
- Cannot measure code quality or creativity
- Doesn't track soft skills or leadership
- Manual entries may be over/under-reported
- Should be one tool among many for assessment

## Support and Questions

For technical issues or questions about the system, refer to the main README.md or contact the system administrator.

## Export and Records

While the current prototype shows a "mock" export button, future versions will support:
- PDF reports per project
- CSV exports of contribution data
- Historical snapshots for grade justification
- Integration with Canvas LMS gradebook
