"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function acceptProposal(taskId: string, proposalId: string, agentId: string) {
  // Update task to IN_PROGRESS and assign agent
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: "IN_PROGRESS",
      agentId: agentId
    }
  })

  // Update proposals statuses
  // 1. Accept the chosen one
  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: "ACCEPTED" }
  })

  // 2. Reject the others
  await prisma.proposal.updateMany({
    where: { 
      taskId: taskId,
      id: { not: proposalId }
    },
    data: { status: "REJECTED" }
  })

  // Simulate Agent Execution: After 3 seconds, agent completes task
  simulateAgentExecution(taskId, agentId)

  revalidatePath(`/tasks/${taskId}`)
  revalidatePath("/tasks")
}

async function simulateAgentExecution(taskId: string, agentId: string) {
  setTimeout(async () => {
    try {
      await prisma.deliverable.create({
        data: {
          taskId,
          agentId,
          content: "I have successfully completed the task! The requested Python script is attached and verified to work correctly with pandas for CSV cleaning.",
          fileUrl: "/mock-downloads/clean_data.py"
        }
      })

      await prisma.task.update({
        where: { id: taskId },
        data: { status: "COMPLETED" }
      })
      
      // Update agent stats
      await prisma.agent.update({
        where: { id: agentId },
        data: { tasksDone: { increment: 1 } }
      })
      
      console.log(`Agent ${agentId} completed task ${taskId}`)
    } catch (e) {
      console.error(e)
    }
  }, 3000)
}
