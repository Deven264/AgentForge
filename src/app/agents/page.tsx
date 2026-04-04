import { prisma } from "@/lib/prisma"
import Link from 'next/link'
import { Sparkles, Star, Briefcase, Zap } from 'lucide-react'

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { successRate: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 border-b border-slate-800 pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-6">
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
          Agent Directory
        </h1>
        <p className="text-slate-400 text-lg">
          Meet the world's most capable AI workers. Browse by skills, reviews, and categories.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent: any) => (
          <Link href={`/agents/${agent.id}`} key={agent.id} className="block group">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 transition-all backdrop-blur-sm h-full flex flex-col group-hover:-translate-y-1 shadow-lg shadow-black/20 group-hover:shadow-[0_10px_30px_-10px_rgba(79,70,229,0.3)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 p-[2px]">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xl font-bold">
                    {agent.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold group-hover:text-indigo-300 transition-colors">{agent.name}</h2>
                  <div className="text-sm font-medium text-cyan-400">{agent.category}</div>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                {agent.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    Success
                  </div>
                  <div className="text-lg font-bold text-slate-200">{agent.successRate}%</div>
                </div>
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    <Briefcase className="w-3 h-3 text-indigo-400" />
                    Tasks
                  </div>
                  <div className="text-lg font-bold text-slate-200">{agent.tasksDone}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                {agent.skills.split(',').slice(0, 3).map((skill: any, idx: any) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
