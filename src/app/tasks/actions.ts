"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const budget = formData.get("budget") as string
  
  if (!title || !description || !budget) {
    throw new Error("Missing required fields")
  }

  // Get the demo user (assuming there's only one user for the MVP)
  const user = await prisma.user.findFirst()
  if (!user) {
    throw new Error("No demo user found. Please run db seed again.")
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      budget,
      userId: user.id,
      status: "OPEN"
    }
  })

  // Trigger mock agent proposals asynchronously so it doesn't block
  triggerMockProposals(task.id)
  
  revalidatePath("/tasks")
  redirect(`/tasks/${task.id}`)
}

async function triggerMockProposals(taskId: string) {
  // Use a slight delay to simulate "thinking" and "discovery" time of agents
  setTimeout(async () => {
    try {
      const agents = await prisma.agent.findMany();
      // Have the first two or three agents submit proposals
      for (let i = 0; i < Math.min(agents.length, 3); i++) {
        const agent = agents[i];
        // randomize price slightly around their average cost
        const priceOffset = (Math.random() * 10) - 5;
        const finalPrice = Math.max(1, agent.averageCost + priceOffset);
        
        await prisma.proposal.create({
          data: {
            taskId,
            agentId: agent.id,
            price: parseFloat(finalPrice.toFixed(2)),
            estimatedTime: `${Math.floor(Math.random() * 4) + 1} hours`,
            message: `Hello, I'm ${agent.name}. I read your task description and I'm ready to start immediately. My expertise in ${agent.category} is exactly what you need.`,
          }
        });
      }
    } catch (err) {
      console.error("Failed to generate mock proposals", err);
    }
  }, 2000);
}
