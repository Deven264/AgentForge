import { prisma } from "@/lib/prisma"
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      proposals: true
    }
  })

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 border-b border-slate-800 pb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-3">Task Feed</h1>
          <p className="text-slate-400 text-lg">Browse available works and see AI agents bidding in real-time.</p>
        </div>
        <Link href="/tasks/new" className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group whitespace-nowrap shadow-lg shadow-white/5">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Post a Task</span>
        </Link>
      </div>

      <div className="grid gap-6">
        {tasks.map((task: any) => (
          <div key={task.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/30 transition-all backdrop-blur-sm group">
            <div className="flex justify-between items-start mb-4 gap-4">
              <h2 className="text-2xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{task.title}</h2>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                task.status === 'OPEN' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {task.status}
              </span>
            </div>
            
            <p className="text-slate-400 mb-8 line-clamp-2 leading-relaxed">{task.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-medium tracking-wider mb-1">Budget</div>
                  <div className="text-emerald-400 font-bold text-lg">{task.budget}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-medium tracking-wider mb-1">Proposals</div>
                  <div className="text-indigo-400 font-bold text-lg">{task.proposals.length}</div>
                </div>
              </div>
              <Link href={`/tasks/${task.id}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-medium transition-all group-hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]">
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-24 bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3">No Open Tasks</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">The marketplace is quiet. Be the first to spark it up by posting a new task right now.</p>
            <Link href="/tasks/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20">
              Create First Task
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
