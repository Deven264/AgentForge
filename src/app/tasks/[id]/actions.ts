"use server"

import { prisma } from "@/lib/prisma"
import { getAgentModel } from "@/lib/ai-provider"
import { generateObject } from "ai"
import { z } from "zod"
import { revalidatePath } from "next/cache"

export async function acceptProposal(taskId: string, proposalId: string, agentId: string) {
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: "IN_PROGRESS",
      agentId: agentId
    }
  })

  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: "ACCEPTED" }
  })

  await prisma.proposal.updateMany({
    where: { 
      taskId: taskId,
      id: { not: proposalId }
    },
    data: { status: "REJECTED" }
  })

  executeTaskWithLLM(taskId, agentId)

  revalidatePath(`/tasks/${taskId}`)
  revalidatePath("/tasks")
}

async function executeTaskWithLLM(taskId: string, agentId: string) {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!task || !agent) return;

    console.log(`\n🔨 === [AgentForge Execution] Task Started ===`);
    console.log(`🤖 Agent: ${agent.name}`);
    console.log(`🧠 Brain: ${agent.modelProvider.toUpperCase()} (${agent.modelId})`);
    console.log(`===============================================`);

    const model = getAgentModel(agent.modelProvider, agent.modelId);

    const prompt = `You are a highly skilled autonomous digital worker on a platform called AgentForge.
You have been hired to fulfill a job based on your exact persona:
Name: ${agent.name}
Category: ${agent.category}
Skills: ${agent.skills}

Your task:
Title: "${task.title}"
Description: "${task.description}"

You must now DO THE TASK. Provide the final completed work. Write any code, compile the research, write the copy, or perform the analysis requested.
Speak as the agent delivering the final result directly to the client. Ensure your tone matches your persona precisely. Your output should be comprehensive.`;

    const { object } = await generateObject({
      model,
      schema: z.object({
        content: z.string().describe("A detailed multi-paragraph message explaining your approach and containing the bulk of the actual delivered work (e.g., code snippet, full article, report)."),
        fileUrl: z.string().nullable().describe("An optional mock filename representing the compiled asset (e.g., 'analysis.xlsx', 'app.tsx'). Leave as null if not applicable.")
      }),
      prompt,
    });

    await prisma.deliverable.create({
      data: {
        taskId,
        agentId,
        content: object.content || "I have completed the task successfully.",
        fileUrl: object.fileUrl || null
      }
    })

    await prisma.task.update({
      where: { id: taskId },
      data: { status: "COMPLETED" }
    })
    
    await prisma.agent.update({
      where: { id: agentId },
      data: { tasksDone: { increment: 1 } }
    })
    
    console.log(`✅ [${agent.name}] Task successfully completed and delivered!`);

  } catch (e: any) {
    console.error(`❌ [${agentId} FAILED EXECUTION] Multi-model Error:`, e?.message)
    // Fallback
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "COMPLETED" }
    })
    await prisma.deliverable.create({
      data: {
        taskId,
        agentId,
        content: "Sorry, I encountered an internal error while computing the deliverables for this task. It's likely that my specific model key was not configured in the `.env` yet. The system falls back safely.",
        fileUrl: null
      }
    })
  }
}
