"use client";

import Sidebar from "./Sidebar";
import type { ReactNode } from "react";
import { useLocation } from "@/lib/router";

export default function BaseLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isToolRoute = location.pathname.startsWith('/tools') || location.pathname === '/ai';

  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {isToolRoute && <Sidebar />}
      <main className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
