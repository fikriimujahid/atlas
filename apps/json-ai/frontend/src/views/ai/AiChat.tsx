"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SEO from "@/components/seo/SEO";
import Sidebar, { type Conversation } from "@/components/layout/Sidebar";
import { Send, Sparkles, Menu, X } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ConversationData extends Conversation {
  messages: Message[];
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm JSON-AI, your AI assistant. Drop broken JSON here, ask me to explain a payload, or request me to generate a new schema for you.",
};

function createConversation(firstMessage?: string): ConversationData {
  return {
    id: Date.now().toString(),
    title: firstMessage ? firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "…" : "") : "New conversation",
    updatedAt: new Date(),
    messages: [WELCOME_MESSAGE],
  };
}

export default function AiChat() {
  const [conversations, setConversations] = useState<ConversationData[]>(() => [createConversation()]);
  const [activeId, setActiveId] = useState<string>(() => conversations[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const messages = activeConv?.messages ?? [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Conversation management ──

  const handleNew = useCallback(() => {
    const conv = createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setInput("");
    setSidebarOpen(false);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setInput("");
    setSidebarOpen(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (id === activeId) {
        const fallback = next[0] ?? createConversation();
        if (next.length === 0) {
          setActiveId(fallback.id);
          return [fallback];
        }
        setActiveId(next[0].id);
      }
      return next;
    });
  }, [activeId]);

  // ── Send message ──

  const handleSend = useCallback(() => {
    if (!input.trim() || !activeConv) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const trimmedInput = input.trim();
    setInput("");

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        const isFirstUserMsg = c.messages.filter((m) => m.role === "user").length === 0;
        return {
          ...c,
          title: isFirstUserMsg ? trimmedInput.slice(0, 40) + (trimmedInput.length > 40 ? "…" : "") : c.title,
          updatedAt: new Date(),
          messages: [...c.messages, userMsg],
        };
      })
    );

    // Mock AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here is a mock response to: **"${trimmedInput}"**\n\n\`\`\`json\n{\n  "status": "success",\n  "message": "This is simulated data."\n}\n\`\`\``,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, updatedAt: new Date(), messages: [...c.messages, aiMsg] }
            : c
        )
      );
    }, 900);
  }, [input, activeConv, activeId]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SEO title="AI JSON Assistant" description="Talk to an AI to fix, explain, or generate JSON payloads." />

      {/* Sidebar — desktop always visible, mobile overlay */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onNew={handleNew}
          onDelete={handleDelete}
        />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Chat header */}
        <div className="shrink-0 border-b bg-card px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <p className="font-semibold text-sm truncate">
              {activeConv?.title ?? "AI Assistant"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide"
        >
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-background prose-pre:border prose-pre:rounded-lg prose-pre:p-3 prose-p:my-1 prose-headings:my-2">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="shrink-0 border-t bg-card px-4 py-3">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="max-w-3xl mx-auto flex items-end gap-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask AI to format, fix, explain or generate JSON… (Enter to send)"
              rows={1}
              className="flex-1 resize-none bg-muted border border-input rounded-xl text-sm placeholder:text-muted-foreground px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition-all max-h-40 overflow-y-auto"
              style={{ minHeight: "48px" }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            JSON-AI can make mistakes. Always verify important output.
          </p>
        </div>
      </div>
    </div>
  );
}
