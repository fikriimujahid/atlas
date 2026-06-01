"use client";

import { useState, useRef, useEffect } from "react";
import SEO from "@/components/seo/SEO";
import { Send, Sparkles } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm JSON-AI, your AI Assistant. Drop broken JSON here, ask me to explain a payload, or request me to generate a new schema for you."
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here is the mock generation you requested:\n\n\`\`\`json\n{\n  "status": "success",\n  "message": "This is simulated data."\n}\n\`\`\``
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-4rem)] lg:h-screen w-full">
      <SEO title="AI JSON Assistant" description="Talk to an AI to fix, explain, or generate JSON payloads." />
      
      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col p-4 sm:p-8 overflow-hidden gap-4">
        <div className="flex items-center gap-3 shrink-0 px-2 pt-2">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">AI Agent Workspace</h1>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">Smart Fix & Generate</p>
          </div>
        </div>

        <div className="flex-1 bg-slate-900 rounded-2xl shadow-xl flex flex-col overflow-hidden text-white min-h-0">
          <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/90">AI Assistant</h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-[9px] font-bold uppercase tracking-wider shadow-sm">Online</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div className={`rounded-xl p-4 max-w-[90%] sm:max-w-[75%] ${
                  msg.role === "assistant" ? "bg-white/10 border border-white/10 backdrop-blur-sm shadow-sm" : "bg-indigo-600 shadow-sm"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="text-sm leading-relaxed opacity-95 prose prose-invert prose-sm max-w-none prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-3 prose-p:my-1 prose-headings:my-2">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 sm:p-4 bg-slate-800/50 border-t border-white/10 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-3 max-w-4xl mx-auto"
            >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to format, fix, or write JSON..." 
                className="flex-1 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-white/30 h-12 px-4 outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim()} 
                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl flex items-center justify-center text-white shrink-0 disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-sm"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
