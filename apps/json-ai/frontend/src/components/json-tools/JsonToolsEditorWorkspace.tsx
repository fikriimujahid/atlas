"use client";

import { Copy } from "lucide-react";
import JsonEditor from "@/components/editor/JsonEditor";
import { getJsonToolOutputLanguage } from "@/constants/json-tools";
import type { JsonTool } from "@/types/tools";

interface JsonToolsEditorWorkspaceProps {
  activeTool: JsonTool;
  input: string;
  isCompare: boolean;
  isConverter: boolean;
  onCopyOutput: () => void;
  onInputChange: (value: string) => void;
  onRightInputChange: (value: string) => void;
  output: string;
  rightInput: string;
}

function getOutputLabel(activeTool: JsonTool) {
  if (activeTool === "typescript") return "Output · TypeScript";
  if (activeTool === "schema") return "Output · JSON Schema";
  if (activeTool === "sql") return "Output · SQL";
  if (activeTool === "csv") return "Output · CSV";
  return "Output";
}

export default function JsonToolsEditorWorkspace({
  activeTool,
  input,
  isCompare,
  isConverter,
  onCopyOutput,
  onInputChange,
  onRightInputChange,
  output,
  rightInput,
}: JsonToolsEditorWorkspaceProps) {
  return (
    <div className="flex-1 min-h-0 p-3 flex flex-col">
      {isCompare && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 min-h-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
              Original
            </p>
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
              <JsonEditor value={input} onChange={(value) => onInputChange(value ?? "")} />
            </div>
          </div>
          <div className="flex flex-col gap-2 min-h-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
              Modified
            </p>
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
              <JsonEditor value={rightInput} onChange={(value) => onRightInputChange(value ?? "")} />
            </div>
          </div>
        </div>
      )}

      {isConverter && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 min-h-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
              Input JSON
            </p>
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
              <JsonEditor value={input} onChange={(value) => onInputChange(value ?? "")} />
            </div>
          </div>
          <div className="flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {getOutputLabel(activeTool)}
              </p>
              {output && (
                <button
                  onClick={onCopyOutput}
                  className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy output
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
              <JsonEditor
                value={output}
                language={getJsonToolOutputLanguage(activeTool)}
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {!isCompare && !isConverter && (
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
            JSON Input
          </p>
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden border shadow-sm flex flex-col">
            <JsonEditor value={input} onChange={(value) => onInputChange(value ?? "")} />
          </div>
        </div>
      )}
    </div>
  );
}
