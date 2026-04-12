import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@example.com',
    },
  })

  const agents = [
    {
      name: 'Groq',
      category: 'Coding',
      modelProvider: 'groq',
      modelId: 'llama-3.1-8b-instant',
      skills: 'Python, TypeScript, Node.js',
      successRate: 97.5,
      tasksDone: 124,
      averageCost: 15.0,
      description: 'Expert backend developer with a focus on writing clean and efficient scripts. Analytical and highly logical in problem-solving.',
    },
    {
      name: 'Gemini',
      category: 'Research',
      modelProvider: 'google',
      modelId: 'gemini-2.5-flash',
      skills: 'Data Analysis, Web Scraping, Report Generation',
      successRate: 94.0,
      tasksDone: 45,
      averageCost: 10.0,
      description: 'Specializes in profound market research and competitor analysis. Thorough, inquisitive, and extremely detail-oriented.',
    },
    {
      name: 'Cohere',
      category: 'Research',
      modelProvider: 'cohere',
      modelId: 'command-r-08-2024',
      skills: 'Academic Summarization, PDF Parsing',
      successRate: 99.0,
      tasksDone: 300,
      averageCost: 12.0,
      description: 'Fast and reliable academic paper summarizer. Academic tone, precise, and excels at synthesizing complex information.',
    },
    {
      name: 'Mistral',
      category: 'Content',
      modelProvider: 'mistral',
      modelId: 'open-mistral-nemo',
      skills: 'Copywriting, SEO, Email Drafts',
      successRate: 96.0,
      tasksDone: 89,
      averageCost: 18.0,
      description: 'Creative and persuasive writer. Excellent at crafting marketing copy, blogs, and compelling call-to-actions. Tone is enthusiastic and engaging.',
    },
    {
      name: 'OpenRouter',
      category: 'Business',
      modelProvider: 'openrouter',
      modelId: 'meta-llama/llama-3.1-8b-instruct:free',
      skills: 'Financial Analysis, Pitch Decks, Strategy',
      successRate: 98.5,
      tasksDone: 53,
      averageCost: 35.0,
      description: 'Management consultant persona. Professional, sharp, and focused on ROI and strategic growth.',
    },
    {
      name: 'DeepSeek',
      category: 'Design',
      modelProvider: 'deepseek',
      modelId: 'deepseek-chat',
      skills: 'UI/UX, CSS, Landing Pages',
      successRate: 92.0,
      tasksDone: 210,
      averageCost: 22.0,
      description: 'Creative UI designer with a flair for modern, vibrant, and accessible web experiences. Values aesthetics and user experience highly.',
    }
  ]

  // Prevent duplicates by wiping old agents before seeding
  await prisma.agent.deleteMany({})

  for (const agent of agents) {
    await prisma.agent.create({
      data: agent,
    })
  }

  console.log('Seeded database with diverse multi-model AI personas successfully!')
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
