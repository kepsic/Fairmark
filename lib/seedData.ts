import { Group } from '@/context/GroupContext'

// Seed data for demo purposes
export const seedDemoData = () => {
  const userNames = ['Alice Johnson', 'Bob Smith', 'Charlie Davis', 'Diana Martinez']

  const projects = [
    {
      name: 'E-Commerce Platform',
      description: 'Building a full-stack online shopping platform with React and Node.js',
      totalTasksNeeded: 50,
    },
    {
      name: 'Mobile Fitness App',
      description: 'Cross-platform fitness tracking application with workout plans and nutrition',
      totalTasksNeeded: 40,
    },
    {
      name: 'AI Chatbot System',
      description: 'Intelligent customer service chatbot using machine learning and NLP',
      totalTasksNeeded: 35,
    },
  ]

  const groups: Group[] = []

  // Create each project with random team members
  projects.forEach((project, index): void => {
    const groupId = `demo-group-${index + 1}`

    // Randomly assign 2-4 users to each project
    const numMembers = 2 + Math.floor(Math.random() * 3) // 2 to 4 members
    const shuffledUsers = [...userNames].sort(() => Math.random() - 0.5)
    const selectedUsers = shuffledUsers.slice(0, numMembers)

    // Generate random contributions for each member
    const members = selectedUsers.map((userName, memberIndex) => {
      // Create variety in contributions for demo purposes
      let hours, tasks

      if (index === 0) {
        // E-Commerce: Unbalanced (one person doing most work)
        if (memberIndex === 0) {
          hours = 35 + Math.floor(Math.random() * 10)
          tasks = 25 + Math.floor(Math.random() * 5)
        } else {
          hours = 5 + Math.floor(Math.random() * 5)
          tasks = 3 + Math.floor(Math.random() * 3)
        }
      } else if (index === 1) {
        // Mobile App: Slightly unbalanced (two people doing most)
        if (memberIndex < 2) {
          hours = 20 + Math.floor(Math.random() * 8)
          tasks = 15 + Math.floor(Math.random() * 5)
        } else {
          hours = 5 + Math.floor(Math.random() * 5)
          tasks = 2 + Math.floor(Math.random() * 3)
        }
      } else {
        // AI Chatbot: Balanced
        hours = 15 + Math.floor(Math.random() * 10)
        tasks = 10 + Math.floor(Math.random() * 5)
      }

      return {
        id: `demo-member-${groupId}-${memberIndex}`,
        name: userName,
        hours,
        tasks,
        role: (memberIndex === 0 ? 'member' : 'member') as 'member' | 'sherpa',
      }
    })

    groups.push({
      id: groupId,
      name: project.name,
      description: project.description,
      members,
      tasks: [],
      totalTasksNeeded: project.totalTasksNeeded,
      projectLead: members[0]?.name,
    })
  })

  return {
    groups,
    demoUser: userNames[0], // Default login as Alice
  }
}
