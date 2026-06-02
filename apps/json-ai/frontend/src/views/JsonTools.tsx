"use client";

import { useState, useCallback } from "react";
import SEO from "@/components/seo/SEO";
import JsonEditor from "@/components/editor/JsonEditor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Copy,
  Download,
  Wand2,
  Minimize2,
  CheckCircle2,
  XCircle,
  Trash2,
  AlignLeft,
  ArrowLeftRight,
  FileJson,
  FileCode2,
  Database,
  Table,
  Save,
  Clock,
  BookMarked,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import {
  formatJsonString,
  minifyJsonString,
  validateJsonString,
  compareJsonStrings,
  generateJsonSchemaString,
  generateTypeScriptString,
  generateSqlString,
  generateCsvString,
} from "@/services/tools/toolsApi";

// ─── Types ──────────────────────────────────────────────────────────────────

type Tool = "format" | "validate" | "minify" | "compare" | "schema" | "typescript" | "sql" | "csv";

interface Tab {
  id: Tool;
  label: string;
  icon: React.ElementType;
  group: "core" | "convert";
}

interface Snippet {
  id: string;
  label: string;
  tool: Tool;
  content: string;
  savedAt: Date;
}

const TABS: Tab[] = [
  { id: "format",     label: "Format",      icon: AlignLeft,       group: "core" },
  { id: "validate",   label: "Validate",    icon: CheckCircle2,    group: "core" },
  { id: "minify",     label: "Minify",      icon: Minimize2,       group: "core" },
  { id: "compare",    label: "Compare",     icon: ArrowLeftRight,  group: "core" },
  { id: "schema",     label: "Schema",      icon: FileJson,        group: "convert" },
  { id: "typescript", label: "TypeScript",  icon: FileCode2,       group: "convert" },
  { id: "sql",        label: "SQL",         icon: Database,        group: "convert" },
  { id: "csv",        label: "CSV",         icon: Table,           group: "convert" },
];



// ─── Helper ──────────────────────────────────────────────────────────────────

function copyText(text: string) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
}

function downloadText(text: string, filename: string) {
  if (!text) return;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function outputFilename(tool: Tool): string {
  const map: Record<Tool, string> = {
    format: "formatted.json",
    validate: "input.json",
    minify: "minified.json",
    compare: "input.json",
    schema: "schema.json",
    typescript: "types.ts",
    sql: "data.sql",
    csv: "data.csv",
  };
  return map[tool];
}

function outputLanguage(tool: Tool): string {
  const map: Record<Tool, string> = {
    format: "json",
    validate: "json",
    minify: "json",
    compare: "json",
    schema: "json",
    typescript: "typescript",
    sql: "sql",
    csv: "plaintext",
  };
  return map[tool];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function JsonTools() {
  const [activeTool, setActiveTool] = useState<Tool>("format");
  const [input, setInput] = useState("");
  const [rightInput, setRightInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"saved" | "history">("saved");
  const [history, setHistory] = useState<Snippet[]>([]);

  // Derived validation (for validate tab, always live)
  const validation = validateJsonString(input);
  const compareResult = compareJsonStrings(input, rightInput);

  // ── Actions ──
  const run = useCallback(() => {
    setError(null);
    try {
      let result = "";
      switch (activeTool) {
        case "format": {
          result = formatJsonString(input);
          setInput(result);
          toast.success("JSON formatted");
          break;
        }
        case "minify": {
          result = minifyJsonString(input);
          setInput(result);
          toast.success("JSON minified");
          break;
        }
        case "schema": {
          result = generateJsonSchemaString(input);
          setOutput(result);
          toast.success("Schema generated");
          break;
        }
        case "typescript": {
          result = generateTypeScriptString(input);
          setOutput(result);
          toast.success("TypeScript generated");
          break;
        }
        case "sql": {
          result = generateSqlString(input);
          setOutput(result);
          toast.success("SQL generated");
          break;
        }
        case "csv": {
          result = generateCsvString(input);
          setOutput(result);
          toast.success("CSV generated");
          break;
        }
      }
      // Add to history
      if (input.trim()) {
        const entry: Snippet = {
          id: Date.now().toString(),
          label: `${activeTool} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          tool: activeTool,
          content: input,
          savedAt: new Date(),
        };
        setHistory((prev) => [entry, ...prev].slice(0, 50));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid JSON";
      setError(message);
      toast.error(message);
    }
  }, [activeTool, input]);

  const saveSnippet = () => {
    const content = (output && isConverter) ? output : input;
    if (!content.trim()) { toast.error("Nothing to save"); return; }
    const label = prompt("Name this snippet:", `${activeTool} snippet`) ?? "";
    if (!label.trim()) return;
    const snippet: Snippet = {
      id: Date.now().toString(),
      label: label.trim(),
      tool: activeTool,
      content,
      savedAt: new Date(),
    };
    setSnippets((prev) => [snippet, ...prev]);
    toast.success("Snippet saved");
  };

  const loadSnippet = (snippet: Snippet) => {
    switchTool(snippet.tool);
    setInput(snippet.content);
    setOutput("");
    toast.success(`Loaded: ${snippet.label}`);
  };

  const deleteSnippet = (id: string, list: "saved" | "history") => {
    if (list === "saved") setSnippets((prev) => prev.filter((s) => s.id !== id));
    else setHistory((prev) => prev.filter((s) => s.id !== id));
  };

  const switchTool = (tool: Tool) => {
    setActiveTool(tool);
    setOutput("");
    setError(null);
  };

  const clearAll = () => {
    setInput("");
    setRightInput("");
    setOutput("");
    setError(null);
  };

  // ── Layout flags ──
  const isCompare = activeTool === "compare";
  const isConverter = ["schema", "typescript", "sql", "csv"].includes(activeTool);
  const isValidate = activeTool === "validate";
  const showRunButton = !isValidate && !isCompare;
  const showOutput = isConverter && !!output;

  const runLabel: Record<Tool, string> = {
    format: "Format",
    validate: "Validate",
    minify: "Minify",
    compare: "Compare",
    schema: "Generate Schema",
    typescript: "Generate Types",
    sql: "Generate SQL",
    csv: "Convert to CSV",
  };

  const currentList = sidebarTab === "saved" ? snippets : history;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SEO title="JSON Tools — Format, Validate, Convert" description="All-in-one JSON toolkit. Format, validate, minify, compare, and convert JSON in one place." />

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <aside className="w-60 shrink-0 border-r bg-card flex flex-col h-full">
          {/* Sidebar header */}
          <div className="shrink-0 flex items-center justify-between px-3 h-12 border-b">
            <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium gap-0.5">
              <button
                onClick={() => setSidebarTab("saved")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${sidebarTab === "saved" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <BookMarked className="w-3 h-3" /> Saved
              </button>
              <button
                onClick={() => setSidebarTab("history")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${sidebarTab === "history" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Clock className="w-3 h-3" /> History
              </button>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
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
                  onClick={() => loadSnippet(item)}
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
                    onClick={(e) => { e.stopPropagation(); deleteSnippet(item.id, sidebarTab); }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all mt-0.5"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Save button */}
          <div className="shrink-0 p-3 border-t">
            <button
              onClick={saveSnippet}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save current JSON
            </button>
          </div>
        </aside>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <div className="shrink-0 border-b bg-card px-3 py-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Sidebar toggle + tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mr-1"
                  title="Open sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
              {TABS.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTool === tab.id;
                const prevGroup = i > 0 ? TABS[i - 1].group : tab.group;
                return (
                  <span key={tab.id} className="contents">
                    {tab.group !== prevGroup && (
                      <span className="w-px h-5 bg-border mx-1 shrink-0" />
                    )}
                    <button
                      onClick={() => switchTool(tab.id)}
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

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {showRunButton && (
                <Button size="sm" onClick={run} className="gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  {runLabel[activeTool]}
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => copyText(showOutput ? output : input)}>
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => downloadText(showOutput ? output : input, outputFilename(activeTool))}>
                <Download className="w-3.5 h-3.5" /> Save
              </Button>
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground" onClick={clearAll}>
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Status banner */}
        {(error || (isValidate && input.trim())) && (
          <div className={`shrink-0 px-4 py-2 text-sm flex items-center gap-2 border-b ${
            error || !validation.isValid
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
          }`}>
            {error || !validation.isValid ? (
              <><XCircle className="w-4 h-4 shrink-0" /><span className="font-mono text-xs">{error ?? validation.error}</span></>
            ) : (
              <><CheckCircle2 className="w-4 h-4 shrink-0" /><span className="font-medium">Valid JSON</span></>
            )}
          </div>
        )}

        {/* Compare banner */}
        {isCompare && (input.trim() || rightInput.trim()) && (
          <div className={`shrink-0 px-4 py-2 text-sm flex items-center gap-2 border-b ${
            !compareResult.left.isValid || !compareResult.right.isValid
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : compareResult.areEqual
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
          }`}>
            {!compareResult.left.isValid ? (
              <><XCircle className="w-4 h-4 shrink-0" /><span className="font-mono text-xs">Left: {compareResult.left.error}</span></>
            ) : !compareResult.right.isValid ? (
              <><XCircle className="w-4 h-4 shrink-0" /><span className="font-mono text-xs">Right: {compareResult.right.error}</span></>
            ) : compareResult.areEqual ? (
              <><CheckCircle2 className="w-4 h-4 shrink-0" /><span className="font-medium">Payloads are identical</span></>
            ) : (
              <><XCircle className="w-4 h-4 shrink-0" /><span className="font-medium">Payloads differ</span></>
            )}
          </div>
        )}

        {/* Editor area */}
        <div className="flex-1 min-h-0 p-3 flex flex-col">
          {/* Compare */}
          {isCompare && (
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2 min-h-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Original</p>
                <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
                  <JsonEditor value={input} onChange={(v) => setInput(v ?? "")} />
                </div>
              </div>
              <div className="flex flex-col gap-2 min-h-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Modified</p>
                <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
                  <JsonEditor value={rightInput} onChange={(v) => setRightInput(v ?? "")} />
                </div>
              </div>
            </div>
          )}

          {/* Converter */}
          {isConverter && (
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2 min-h-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Input JSON</p>
                <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
                  <JsonEditor value={input} onChange={(v) => setInput(v ?? "")} />
                </div>
              </div>
              <div className="flex flex-col gap-2 min-h-0">
                <div className="flex items-center justify-between shrink-0">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Output{activeTool === "typescript" && " · TypeScript"}{activeTool === "schema" && " · JSON Schema"}{activeTool === "sql" && " · SQL"}{activeTool === "csv" && " · CSV"}
                  </p>
                  {output && (
                    <button onClick={() => copyText(output)} className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                      <Copy className="w-3 h-3" /> Copy output
                    </button>
                  )}
                </div>
                <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
                  <JsonEditor value={output} language={outputLanguage(activeTool)} readOnly />
                </div>
              </div>
            </div>
          )}

          {/* Single editor */}
          {!isCompare && !isConverter && (
            <div className="flex-1 min-h-0 flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">JSON Input</p>
              <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
                <JsonEditor value={input} onChange={(v) => setInput(v ?? "")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
