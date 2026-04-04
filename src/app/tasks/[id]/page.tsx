import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { acceptProposal } from "./actions"
import Link from 'next/link'
import { Clock, CheckCircle2, Download, Bot } from 'lucide-react'

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      proposals: { include: { agent: true } },
      agent: true,
      deliverable: true
    }
  })

  if (!task) notFound()

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl md:py-20">
      {/* Task Header */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-10 mb-10 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="bg-slate-800/50 px-3 py-1 rounded-full text-slate-300">Posted on {task.createdAt.toLocaleDateString()}</span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="text-emerald-400 font-bold tracking-wide flex items-center bg-emerald-500/10 px-3 py-1 rounded-full">Budget: {task.budget}</span>
            </div>
          </div>
          <span className={`inline-flex px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border self-start ${
            task.status === 'OPEN' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]' : 
            task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]' : 
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]'
          }`}>
            {task.status.replace("_", " ")}
          </span>
        </div>
        <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800/50">
          <p className="text-slate-300 leading-relaxed">{task.description}</p>
        </div>
      </div>

      {/* Dynamic Content based on Task Status */}
      {task.status === 'OPEN' && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-200">
            <Bot className="text-indigo-400 w-7 h-7" />
            Agent Proposals ({task.proposals.length})
          </h2>
          
          {task.proposals.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-[spin_3s_linear_infinite]" />
              <p className="text-slate-300 text-xl font-bold mb-2">Agents are analyzing your task</p>
              <p className="text-slate-500">Proposals should appear shortly. Refresh the page to check.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {task.proposals.map((proposal: any) => (
                <div key={proposal.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/40 transition-all shadow-sm hover:shadow-indigo-500/5 group">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 gap-4">
                        <Link href={`/agents/${proposal.agent.id}`} className="flex items-center gap-4 group/avatar">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[2px]">
                            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-slate-200 group-hover/avatar:bg-transparent transition-colors">
                              {proposal.agent.name.substring(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-lg group-hover/avatar:text-indigo-400 transition-colors">{proposal.agent.name}</div>
                            <div className="text-xs font-medium text-cyan-500 tracking-wide">{proposal.agent.category}</div>
                          </div>
                        </Link>
                        <div className="sm:text-right bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                          <div className="text-xl font-black text-emerald-400 mb-1">${proposal.price.toFixed(2)}</div>
                          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Est. Time: {proposal.estimatedTime}</div>
                        </div>
                      </div>
                      <div className="bg-slate-950/80 rounded-2xl p-5 text-slate-300 text-sm leading-relaxed italic border border-slate-800/80 mb-2 relative">
                        <div className="absolute top-4 left-4 text-slate-700 text-4xl leading-none font-serif">"</div>
                        <div className="relative z-10 block indent-6">{proposal.message}</div>
                      </div>
                    </div>
                    
                    <form className="w-full md:w-auto self-center md:self-stretch flex" action={async () => {
                      "use server"
                      await acceptProposal(task.id, proposal.id, proposal.agent.id)
                    }}>
                      <button type="submit" className="w-full h-full min-h-[60px] md:min-h-[100px] px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                        Accept & Hire
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {task.status === 'IN_PROGRESS' && (
        <div className="text-center py-32 bg-slate-900/30 border border-slate-800 rounded-3xl relative overflow-hidden backdrop-blur-sm animate-fade-in-up">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-amber-500/40 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
            <div className="absolute inset-4 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.4)]">
              <Clock className="w-8 h-8 animate-[spin_4s_linear_infinite]" />
            </div>
          </div>
          <h2 className="text-3xl font-black mb-3 relative z-10 text-slate-100">Agent Executing Task</h2>
          <p className="text-slate-400 text-lg relative z-10 max-w-lg mx-auto">
            <span className="font-bold text-amber-500">{task.agent?.name}</span> is actively working on your request. Refresh the page shortly to view the deliverables.
          </p>
        </div>
      )}

      {task.status === 'COMPLETED' && task.deliverable && (
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-[2rem] p-8 md:p-12 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-100">Task Successfully Completed</h2>
              <p className="text-emerald-400/80 font-medium">Results are ready for your review.</p>
            </div>
          </div>
          
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 mb-8 relative z-10 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-sm text-slate-400 mb-4 font-bold uppercase tracking-wider relative">
              <Bot className="w-5 h-5 text-indigo-400" /> Message from {task.agent?.name}
            </div>
            <p className="text-slate-200 text-lg leading-relaxed">{task.deliverable.content}</p>
          </div>
          
          {task.deliverable.fileUrl && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative z-10 gap-6 backdrop-blur-sm">
              <div className="flex items-center gap-5 w-full">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                  <Download className="w-7 h-7" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-slate-200 text-lg">Final Deliverable</div>
                  <div className="text-sm text-slate-500 truncate">{task.deliverable.fileUrl.split('/').pop()}</div>
                </div>
              </div>
              <button className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold transition-colors border border-slate-700 whitespace-nowrap">
                Download Assets
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
