"use client";

import { Link } from "@/lib/router";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Plus, MessageSquare, Trash2, LogOut, LayoutDashboard, LogIn } from "lucide-react";

export interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete }: SidebarProps) {
  const router = useRouter();
  const { status, user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  // Group conversations by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const groups: { label: string; items: Conversation[] }[] = [
    {
      label: "Today",
      items: conversations.filter((c) => c.updatedAt >= today),
    },
    {
      label: "Yesterday",
      items: conversations.filter((c) => c.updatedAt >= yesterday && c.updatedAt < today),
    },
    {
      label: "Previous 7 days",
      items: conversations.filter((c) => c.updatedAt >= sevenDaysAgo && c.updatedAt < yesterday),
    },
    {
      label: "Older",
      items: conversations.filter((c) => c.updatedAt < sevenDaysAgo),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">J</div>
          <span className="font-bold text-sm">JSON-AI</span>
        </Link>
        <button
          onClick={onNew}
          title="New chat"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* New chat button */}
      <div className="px-3 pt-3 shrink-0">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          New conversation
        </button>
      </div>

      {/* History list */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-hide min-h-0">
        {groups.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8 px-4">
            No conversations yet. Start a new chat!
          </p>
        )}
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1">
              {group.label}
            </p>
            {group.items.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  activeId === conv.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
                onClick={() => onSelect(conv.id)}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <span className="flex-1 truncate">{conv.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t shrink-0 space-y-1">
        {status === "authenticated" && user ? (
          <>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase shrink-0">
                {user.name?.[0] ?? "U"}
              </div>
              <span className="flex-1 truncate text-xs font-medium text-foreground">{user.name}</span>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Log in
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              Create free account
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
