"use client";

import { Copy, Download, PanelLeft, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JSON_TOOL_TABS } from "@/constants/json-tools";
import type { JsonTool } from "@/types/tools";

interface JsonToolsTopBarProps {
  activeTool: JsonTool;
  aiPanelOpen: boolean;
  onClearAll: () => void;
  onCopyCurrent: () => void;
  onDownloadCurrent: () => void;
  onRun: () => void;
  onSwitchTool: (tool: JsonTool) => void;
  onToggleAiPanel: () => void;
  onToggleSidebar: () => void;
  runLabel: Record<JsonTool, string>;
  showRunButton: boolean;
  sidebarOpen: boolean;
}

export default function JsonToolsTopBar({
  activeTool,
  aiPanelOpen,
  onClearAll,
  onCopyCurrent,
  onDownloadCurrent,
  onRun,
  onSwitchTool,
  onToggleAiPanel,
  onToggleSidebar,
  runLabel,
  showRunButton,
  sidebarOpen,
}: JsonToolsTopBarProps) {
  return (
    <div className="shrink-0 border-b bg-card px-3 py-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mr-1"
              title="Open sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          {JSON_TOOL_TABS.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTool === tab.id;
            const previousGroup = index > 0 ? JSON_TOOL_TABS[index - 1].group : tab.group;

            return (
              <span key={tab.id} className="contents">
                {tab.group !== previousGroup && (
                  <span className="w-px h-5 bg-border mx-1 shrink-0" />
                )}
                <button
                  onClick={() => onSwitchTool(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showRunButton && (
            <Button size="sm" onClick={onRun} className="gap-1.5">
              <Wand2 className="w-3.5 h-3.5" />
              {runLabel[activeTool]}
            </Button>
          )}

          <Button size="sm" variant="outline" className="gap-1.5" onClick={onCopyCurrent}>
            <Copy className="w-3.5 h-3.5" /> Copy
          </Button>

          <Button size="sm" variant="outline" className="gap-1.5" onClick={onDownloadCurrent}>
            <Download className="w-3.5 h-3.5" /> Save
          </Button>

          <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground" onClick={onClearAll}>
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </Button>

          <span className="w-px h-5 bg-border shrink-0" />

          <Button
            size="sm"
            variant={aiPanelOpen ? "default" : "outline"}
            className="gap-1.5"
            onClick={onToggleAiPanel}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI
          </Button>
        </div>
      </div>
    </div>
  );
}
