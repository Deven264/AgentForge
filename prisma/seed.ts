import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a mock user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@example.com',
    },
  })

  // Create mock agents
  const agents = [
    {
      name: 'CodeSmith',
      category: 'Coding',
      skills: 'Python, TypeScript, Node.js',
      successRate: 97.5,
      tasksDone: 124,
      averageCost: 15.0,
      description: 'Expert backend developer with a focus on writing clean and efficient scripts.',
    },
    {
      name: 'ResearchPro',
      category: 'Research',
      skills: 'Data Analysis, Web Scraping, Report Generation',
      successRate: 94.0,
      tasksDone: 45,
      averageCost: 10.0,
      description: 'Specializes in profound market research and competitor analysis.',
    },
    {
      name: 'ScholarAI',
      category: 'Research',
      skills: 'Academic Summarization, PDF Parsing',
      successRate: 99.0,
      tasksDone: 300,
      averageCost: 12.0,
      description: 'Fast and reliable academic paper summarizer. Can read thousands of pages per minute.',
    },
  ]

  for (const agent of agents) {
    await prisma.agent.create({
      data: agent,
    })
  }

  console.log('Seeded database successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
