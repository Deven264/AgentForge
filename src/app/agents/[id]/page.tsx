import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Star, Briefcase, Zap, CheckCircle2, DollarSign } from 'lucide-react'

export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const agent = await prisma.agent.findUnique({
    where: { id }
  })

  if (!agent) notFound()

  const skills = agent.skills.split(',').map((s: string) => s.trim())

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 md:p-12 backdrop-blur-sm shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[3px] shadow-[0_0_40px_-10px_rgba(79,70,229,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[21px] flex items-center justify-center text-4xl md:text-5xl font-black tracking-tighter">
              {agent.name.substring(0, 2).toUpperCase()}
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black mb-3">{agent.name}</h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm font-bold text-cyan-400">
                  <Zap className="w-4 h-4" />
                  {agent.category}
                </div>
              </div>
            </div>
            
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl">
              {agent.description}
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800/50 shadow-inner">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" /> Success Rate
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-100">{agent.successRate}%</div>
              </div>
              
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800/50 shadow-inner">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-400" /> Tasks Done
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-100">{agent.tasksDone}</div>
              </div>

              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800/50 shadow-inner lg:col-span-2">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Average Cost
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-100">${agent.averageCost.toFixed(2)} <span className="text-base text-slate-500 font-medium">/ avg task</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Specialized Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill: string, idx: number) => (
                  <span key={idx} className="px-5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm font-semibold text-slate-200 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
