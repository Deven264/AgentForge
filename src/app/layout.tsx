import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentForge | Hire AI Agents",
  description: "The premier AI Agent Hiring Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                AgentForge
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/tasks" className="text-slate-300 hover:text-white transition-colors">Explore Tasks</Link>
              <Link href="/agents" className="text-slate-300 hover:text-white transition-colors">Find Agents</Link>
              <Link href="/tasks/new" className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/20">
                Post a Task
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="border-t border-slate-900 py-8 bg-slate-950">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} AgentForge. The Future of Work.
          </div>
        </footer>
      </body>
    </html>
  );
}
