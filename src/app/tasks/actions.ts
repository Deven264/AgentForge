"use server"

import { prisma } from "@/lib/prisma"
import { getAgentModel } from "@/lib/ai-provider"
import { generateObject } from "ai"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const budget = formData.get("budget") as string
  
  if (!title || !description || !budget) {
    throw new Error("Missing required fields")
  }

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

  // Trigger real multi-model proposals asynchronously
  triggerLLMProposals(task)
  
  revalidatePath("/tasks")
  redirect(`/tasks/${task.id}`)
}

async function triggerLLMProposals(task: any) {
  try {
    const agents = await prisma.agent.findMany();
    // Pick 3 random agents
    const selectedAgents = agents.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    console.log(`\n🚀 === [AgentForge Tasks] New Task Triggered ===`);
    console.log(`🤖 Selected Agents for Bidding: ${selectedAgents.map(a => a.name).join(", ")}`);
    console.log(`=================================================`);
    
    for (const agent of selectedAgents) {
      try {
        console.log(`⏳ [${agent.name}] Generating proposal using ${agent.modelProvider.toUpperCase()} (${agent.modelId})...`);
        // Dynamically instantiate the required AI model based on the agent's profile!
        const model = getAgentModel(agent.modelProvider, agent.modelId);
        
        const prompt = `You are a specialized AI worker bidding on a freelance marketplace.
Your persona:
Name: ${agent.name}
Category: ${agent.category}
Skills: ${agent.skills}
Description: ${agent.description}

A user posted this task:
Title: "${task.title}"
Description: "${task.description}"
Budget: ${task.budget}

Write a proposal applying for this task. Pitch yourself strongly based strictly on your named persona and background! Keep it concise (3-4 sentences max).

Make sure the price is a float loosely based around your average cost ($${agent.averageCost}). The estimated time should be realistic like '2 hours'.`;
        
        const { object } = await generateObject({
          model,
          schema: z.object({
            price: z.number().describe("The numeric price bid for the task"),
            estimatedTime: z.string().describe("Estimated time to complete like '4 hours'"),
            message: z.string().describe("Your personalized pitch message")
          }),
          prompt,
        });
        
        await prisma.proposal.create({
          data: {
            taskId: task.id,
            agentId: agent.id,
            price: object.price || agent.averageCost,
            estimatedTime: object.estimatedTime || "A few hours",
            message: object.message || "I'd love to help you with this project."
          }
        });
        
        console.log(`✅ [${agent.name}] Successfully submitted proposal for $${object.price}`);
      } catch (err: any) {
        console.error(`Failed to generate multi-model proposal for agent ${agent.name} using ${agent.modelProvider}:`, err?.message);
      }
    }
  } catch (err) {
    console.error("Failed to fetch agents for proposals", err);
  }
}
