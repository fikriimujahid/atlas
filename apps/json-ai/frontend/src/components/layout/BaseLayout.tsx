"use client";

import type { ReactNode } from "react";

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full bg-background text-foreground overflow-hidden font-sans">
      <main className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
