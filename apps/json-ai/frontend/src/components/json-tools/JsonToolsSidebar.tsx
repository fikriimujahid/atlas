"use client";

import { BookMarked, Clock, LogOut, PanelLeftClose, Save, Trash2 } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import type { JsonSnippet, JsonToolsSidebarTab } from "@/types/tools";

interface JsonToolsSidebarProps {
  currentList: JsonSnippet[];
  isAuthed: boolean;
  onClose: () => void;
  onDeleteSnippet: (id: string, list: JsonToolsSidebarTab) => void;
  onLoadSnippet: (snippet: JsonSnippet) => void;
  onLogout: () => Promise<void>;
  onRequestSignIn: () => void;
  onSaveSnippet: () => void;
  onTabChange: (tab: JsonToolsSidebarTab) => void;
  sidebarTab: JsonToolsSidebarTab;
  user: AuthUser | null;
}

export default function JsonToolsSidebar({
  currentList,
  isAuthed,
  onClose,
  onDeleteSnippet,
  onLoadSnippet,
  onLogout,
  onRequestSignIn,
  onSaveSnippet,
  onTabChange,
  sidebarTab,
  user,
}: JsonToolsSidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r bg-card flex flex-col h-full">
      <div className="shrink-0 flex items-center justify-between px-3 h-12 border-b">
        <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium gap-0.5">
          <button
            onClick={() => onTabChange("saved")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${
              sidebarTab === "saved"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookMarked className="w-3 h-3" /> Saved
          </button>
          <button
            onClick={() => onTabChange("history")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${
              sidebarTab === "history"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-3 h-3" /> History
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Close sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide min-h-0">
        {currentList.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            {sidebarTab === "saved"
              ? "No saved snippets yet.\nClick the Save button to store JSON."
              : "No history yet.\nRun a tool to see past inputs here."}
          </div>
        ) : (
          currentList.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-2 px-3 py-2 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onLoadSnippet(item)}
            >
              <div className="mt-0.5 shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary tracking-wider">
                {item.tool.slice(0, 3)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">
                  {item.content.slice(0, 40).replace(/\s+/g, " ")}
                </p>
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteSnippet(item.id, sidebarTab);
                }}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all mt-0.5"
                title="Remove"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="shrink-0 p-3 border-t">
        <button
          onClick={onSaveSnippet}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          Save current JSON
        </button>
      </div>

      <div className="shrink-0 p-3 border-t">
        {isAuthed && user ? (
          <div className="rounded-xl border bg-muted/40 p-2.5 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary uppercase shrink-0">
                {user.name?.[0] ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
              <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide bg-primary/10 text-primary rounded px-1.5 py-0.5">
                {user.plan}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border bg-background px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Log out
            </button>
          </div>
        ) : (
          <div className="rounded-xl border bg-muted/40 p-2.5 space-y-2">
            <p className="text-[10px] text-muted-foreground">Sign in to save snippets &amp; use AI.</p>
            <button
              onClick={onRequestSignIn}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
