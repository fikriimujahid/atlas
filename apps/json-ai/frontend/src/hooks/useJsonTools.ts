"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  chatWithJson,
  enhanceOutput,
  explainJson,
  generateJson,
  repairJson,
  type AiChatMessage,
} from "@/services/ai/aiApi";
import {
  compareJsonStrings,
  formatJsonString,
  generateCsvString,
  generateJsonSchemaString,
  generateSqlString,
  generateTypeScriptString,
  minifyJsonString,
  validateJsonString,
} from "@/services/tools/toolsApi";
import {
  JSON_CONVERTER_TOOLS,
  JSON_TOOL_RUN_LABEL,
  getJsonToolOutputFilename,
} from "@/constants/json-tools";
import { useAuth } from "@/hooks/useAuth";
import type {
  JsonSnippet,
  JsonTool,
  JsonToolsAuthFeature,
  JsonToolsSidebarTab,
} from "@/types/tools";

function copyText(text: string) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
}

function downloadText(text: string, filename: string) {
  if (!text) return;

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}

export function useJsonTools() {
  const { status, user, logout } = useAuth();
  const isAuthed = status === "authenticated";

  const [activeTool, setActiveTool] = useState<JsonTool>("format");
  const [input, setInput] = useState("");
  const [rightInput, setRightInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [snippets, setSnippets] = useState<JsonSnippet[]>([]);
  const [history, setHistory] = useState<JsonSnippet[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<JsonToolsSidebarTab>("saved");

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRepairLoading, setAiRepairLoading] = useState(false);
  const aiScrollRef = useRef<HTMLDivElement>(null);

  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [authGateFeature, setAuthGateFeature] = useState<JsonToolsAuthFeature>("ai");

  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }
  }, [aiMessages, aiLoading]);

  const validation = validateJsonString(input);
  const compareResult = compareJsonStrings(input, rightInput);

  const isCompare = activeTool === "compare";
  const isConverter = JSON_CONVERTER_TOOLS.includes(activeTool);
  const isValidate = activeTool === "validate";
  const showRunButton = !isValidate && !isCompare;
  const showOutput = isConverter && !!output;

  const currentList = useMemo(
    () => (sidebarTab === "saved" ? snippets : history),
    [sidebarTab, snippets, history],
  );

  const currentEditorContent = useMemo(
    () => (showOutput ? output : input),
    [showOutput, output, input],
  );

  const openAuthGateForFeature = useCallback((feature: JsonToolsAuthFeature) => {
    setAuthGateFeature(feature);
    setAuthGateOpen(true);
  }, []);

  const requireAuth = useCallback(
    (feature: JsonToolsAuthFeature): boolean => {
      if (isAuthed) return true;
      openAuthGateForFeature(feature);
      return false;
    },
    [isAuthed, openAuthGateForFeature],
  );

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
        default: {
          break;
        }
      }

      const historyContent =
        activeTool === "format" || activeTool === "minify" ? result : input;

      if (historyContent.trim()) {
        const entry: JsonSnippet = {
          id: Date.now().toString(),
          label: `${activeTool} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          tool: activeTool,
          content: historyContent,
          savedAt: new Date(),
        };

        setHistory((prev) => [entry, ...prev].slice(0, 50));
      }
    } catch (runError) {
      const message = runError instanceof Error ? runError.message : "Invalid JSON";
      setError(message);
      toast.error(message);
    }
  }, [activeTool, input]);

  const switchTool = useCallback((tool: JsonTool) => {
    setActiveTool(tool);
    setOutput("");
    setError(null);
  }, []);

  const clearAll = useCallback(() => {
    setInput("");
    setRightInput("");
    setOutput("");
    setError(null);
  }, []);

  const saveSnippet = useCallback(() => {
    if (!requireAuth("save")) return;

    const content = output && isConverter ? output : input;

    if (!content.trim()) {
      toast.error("Nothing to save");
      return;
    }

    const label = prompt("Name this snippet:", `${activeTool} snippet`) ?? "";

    if (!label.trim()) return;

    const snippet: JsonSnippet = {
      id: Date.now().toString(),
      label: label.trim(),
      tool: activeTool,
      content,
      savedAt: new Date(),
    };

    setSnippets((prev) => [snippet, ...prev]);
    toast.success("Snippet saved");
  }, [activeTool, input, isConverter, output, requireAuth]);

  const loadSnippet = useCallback(
    (snippet: JsonSnippet) => {
      switchTool(snippet.tool);
      setInput(snippet.content);
      setOutput("");
      toast.success(`Loaded: ${snippet.label}`);
    },
    [switchTool],
  );

  const deleteSnippet = useCallback((id: string, list: JsonToolsSidebarTab) => {
    if (list === "saved") {
      setSnippets((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const aiSendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || aiLoading) return;
      if (!requireAuth("ai")) return;

      const userMessage: AiChatMessage = { role: "user", content: userText };
      const nextMessages = [...aiMessages, userMessage];

      setAiMessages(nextMessages);
      setAiInput("");
      setAiLoading(true);

      try {
        const result = await chatWithJson(nextMessages, input);
        setAiMessages((prev) => [...prev, { role: "assistant", content: result }]);
      } catch (aiError) {
        const message = aiError instanceof Error ? aiError.message : "AI request failed.";
        toast.error(message);
        setAiMessages((prev) => [...prev, { role: "assistant", content: `Error: ${message}` }]);
      } finally {
        setAiLoading(false);
      }
    },
    [aiLoading, aiMessages, input, requireAuth],
  );

  const aiQuickAction = useCallback(
    async (action: "explain" | "generate" | "enhance") => {
      if (aiLoading) return;
      if (!requireAuth("ai")) return;

      setAiPanelOpen(true);
      setAiLoading(true);

      const editorContent = isConverter && output ? output : input;
      let result = "";

      try {
        if (action === "explain") {
          if (!input.trim()) {
            toast.error("Add JSON to the editor first.");
            setAiLoading(false);
            return;
          }

          setAiMessages((prev) => [...prev, { role: "user", content: "Explain this JSON for me." }]);
          result = await explainJson(input);
        }

        if (action === "generate") {
          const description = prompt("Describe the JSON you want to generate:");

          if (!description?.trim()) {
            setAiLoading(false);
            return;
          }

          setAiMessages((prev) => [...prev, { role: "user", content: `Generate JSON: ${description}` }]);
          result = await generateJson(description);
        }

        if (action === "enhance") {
          if (!editorContent.trim()) {
            toast.error("Run a tool first to get output.");
            setAiLoading(false);
            return;
          }

          setAiMessages((prev) => [...prev, { role: "user", content: `Enhance this ${activeTool} output.` }]);
          result = await enhanceOutput(editorContent, activeTool);
        }

        setAiMessages((prev) => [...prev, { role: "assistant", content: result }]);
      } catch (aiError) {
        const message = aiError instanceof Error ? aiError.message : "AI request failed.";
        toast.error(message);
        setAiMessages((prev) => [...prev, { role: "assistant", content: `Error: ${message}` }]);
      } finally {
        setAiLoading(false);
      }
    },
    [activeTool, aiLoading, input, isConverter, output, requireAuth],
  );

  const aiRepair = useCallback(async () => {
    if (!input.trim() || aiRepairLoading) return;
    if (!requireAuth("ai")) return;

    setAiRepairLoading(true);

    try {
      const fixed = await repairJson(input);
      setInput(fixed);
      setError(null);
      toast.success("AI fixed your JSON");

      setAiMessages((prev) => [
        ...prev,
        { role: "user", content: "Fix my broken JSON." },
        {
          role: "assistant",
          content: `Fixed! Here is the corrected JSON:\n\`\`\`json\n${fixed}\n\`\`\``,
        },
      ]);
    } catch (aiError) {
      const message = aiError instanceof Error ? aiError.message : "AI repair failed.";
      toast.error(message);
    } finally {
      setAiRepairLoading(false);
    }
  }, [aiRepairLoading, input, requireAuth]);

  const copyCurrent = useCallback(() => {
    copyText(currentEditorContent);
  }, [currentEditorContent]);

  const downloadCurrent = useCallback(() => {
    downloadText(currentEditorContent, getJsonToolOutputFilename(activeTool));
  }, [activeTool, currentEditorContent]);

  const toggleAiPanel = useCallback(() => {
    if (!requireAuth("ai")) return;
    setAiPanelOpen((prev) => !prev);
  }, [requireAuth]);

  return {
    activeTool,
    aiInput,
    aiLoading,
    aiMessages,
    aiPanelOpen,
    aiRepairLoading,
    aiScrollRef,
    authGateFeature,
    authGateOpen,
    compareResult,
    currentList,
    error,
    input,
    isAuthed,
    isCompare,
    isConverter,
    isValidate,
    output,
    rightInput,
    runLabel: JSON_TOOL_RUN_LABEL,
    showRunButton,
    sidebarOpen,
    sidebarTab,
    user,
    validation,

    aiQuickAction,
    aiRepair,
    aiSendMessage,
    clearAll,
    copyCurrent,
    deleteSnippet,
    downloadCurrent,
    handleLogout,
    loadSnippet,
    openAuthGateForFeature,
    run,
    saveSnippet,
    setAiInput,
    setAiPanelOpen,
    setAuthGateOpen,
    setInput,
    setRightInput,
    setSidebarOpen,
    setSidebarTab,
    switchTool,
    toggleAiPanel,
  };
}
