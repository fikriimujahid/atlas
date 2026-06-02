"use client";

import type { RefObject } from "react";
import Markdown from "react-markdown";
import {
  Loader2,
  MessageSquare,
  PanelRightClose,
  Send,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import type { AiChatMessage } from "@/services/ai/aiApi";

type AiQuickAction = "explain" | "generate" | "enhance";

interface JsonToolsAiPanelProps {
  aiInput: string;
  aiLoading: boolean;
  aiMessages: AiChatMessage[];
  aiRepairLoading: boolean;
  aiScrollRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onInputChange: (value: string) => void;
  onQuickAction: (action: AiQuickAction) => Promise<void>;
  onRepair: () => Promise<void>;
  onSendMessage: (message: string) => Promise<void>;
}

export default function JsonToolsAiPanel({
  aiInput,
  aiLoading,
  aiMessages,
  aiRepairLoading,
  aiScrollRef,
  onClose,
  onInputChange,
  onQuickAction,
  onRepair,
  onSendMessage,
}: JsonToolsAiPanelProps) {
  return (
    <aside className="w-80 shrink-0 border-l bg-card flex flex-col h-full">
      <div className="shrink-0 flex items-center justify-between px-3 h-12 border-b">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Close AI panel"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      <div className="shrink-0 px-3 py-2.5 border-b flex flex-wrap gap-1.5">
        <button
          onClick={() => void onQuickAction("explain")}
          disabled={aiLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-50"
        >
          <MessageSquare className="w-3 h-3" /> Explain
        </button>
        <button
          onClick={() => void onRepair()}
          disabled={aiLoading || aiRepairLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-50"
        >
          <Wrench className="w-3 h-3" /> Fix JSON
        </button>
        <button
          onClick={() => void onQuickAction("generate")}
          disabled={aiLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-50"
        >
          <Zap className="w-3 h-3" /> Generate
        </button>
        <button
          onClick={() => void onQuickAction("enhance")}
          disabled={aiLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3" /> Enhance
        </button>
      </div>

      <div ref={aiScrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-hide min-h-0">
        {aiMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-8">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Use the chips above or type a question. I have the current JSON in context.
            </p>
          </div>
        ) : (
          aiMessages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-2.5 h-2.5 text-primary" />
                </div>
              )}
              <div
                className={`rounded-xl px-3 py-2 max-w-[85%] text-xs leading-relaxed ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-xs dark:prose-invert max-w-none prose-pre:bg-background prose-pre:border prose-pre:rounded prose-pre:p-2 prose-pre:text-[10px] prose-p:my-0.5">
                    <Markdown>{message.content}</Markdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))
        )}

        {aiLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
            </div>
            <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 p-3 border-t">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void onSendMessage(aiInput);
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={aiInput}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void onSendMessage(aiInput);
              }
            }}
            placeholder="Ask about the current JSON..."
            rows={1}
            disabled={aiLoading}
            className="flex-1 resize-none bg-muted border border-input rounded-lg text-xs placeholder:text-muted-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring transition-all max-h-28 overflow-y-auto disabled:opacity-50"
            style={{ minHeight: "36px" }}
          />
          <button
            type="submit"
            disabled={!aiInput.trim() || aiLoading}
            className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            {aiLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
