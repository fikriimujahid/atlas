"use client";

import { Link, useLocation } from "@/lib/router";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";
import { GENERATORS, TOOLS } from "@/constants/tools";

export default function Sidebar() {
  const location = useLocation();
  const router = useRouter();
  const { status, user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex-col hidden lg:flex">
      <div className="p-6 flex items-center gap-2 border-b border-slate-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">J</div>
        <div>
          <h1 className="font-bold text-lg leading-tight">JSON-AI</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">The AI Toolkit</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="text-[11px] font-bold text-slate-400 uppercase px-3 py-2">Toolbox</div>
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = location.pathname === tool.path;
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tool.name}
            </Link>
          );
        })}

        <div className="mt-6 text-[11px] font-bold text-slate-400 uppercase px-3 py-2">Generators</div>
        {GENERATORS.map((tool) => {
          const Icon = tool.icon;
          const isActive = location.pathname === tool.path;
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tool.name}
            </Link>
          );
        })}

        <div className="mt-6 text-[11px] font-bold text-slate-400 uppercase px-3 py-2">AI Assistant</div>
        <Link
          to="/ai"
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
            location.pathname === "/ai"
              ? "bg-indigo-50 text-indigo-700" 
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI Chat
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-slate-400 p-1"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div className="text-xs font-medium">
            {status === "authenticated" && user ? user.name : "Guest User"}
            <p className="text-[10px] text-slate-400">{status === "authenticated" && user ? `${user.plan} Plan` : "Free Plan"}</p>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-[65%]"></div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-tighter">AI Tokens: 6,500 / 10,000</p>
        {status === "authenticated" && user ? (
          <div className="mt-3 grid gap-2">
            <Link to="/dashboard" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-[11px] font-semibold text-slate-600">Dashboard</Link>
            <button onClick={handleLogout} className="w-full rounded-md bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white">Log Out</button>
          </div>
        ) : (
          <div className="mt-3 grid gap-2">
            <Link to="/login" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-[11px] font-semibold text-slate-600">Log In</Link>
            <Link to="/register" className="w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-[11px] font-semibold text-white">Create Account</Link>
          </div>
        )}
      </div>
    </aside>
  );
}
