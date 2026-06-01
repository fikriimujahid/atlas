"use client";

import ToolHeader from "@/components/shared/ToolHeader";
import JsonEditor from "@/components/editor/JsonEditor";
import SEO from "@/components/seo/SEO";
import { CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useJsonCompare } from "@/hooks/useJsonCompare";

export default function JsonCompare() {
  const { leftJson, setLeftJson, rightJson, setRightJson, comparison } = useJsonCompare();

  const comparisonTitle = !comparison.left.isValid
    ? "Left JSON is invalid"
    : !comparison.right.isValid
      ? "Right JSON is invalid"
      : comparison.areEqual
        ? "Payloads match"
        : "Payloads differ";

  const comparisonDescription = !comparison.left.isValid
    ? comparison.left.error
    : !comparison.right.isValid
      ? comparison.right.error
      : comparison.areEqual
        ? "Both JSON payloads resolve to the same normalized structure."
        : "The two JSON payloads are both valid, but they do not resolve to the same normalized structure.";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen w-full">
      <SEO title="JSON Compare Diff" description="Compare two JSON objects." />
      <ToolHeader 
        title="JSON Compare" 
        description="Compare two JSON payloads side by side."
      />

      <div className="flex-1 p-6 pt-2 flex flex-col gap-4 overflow-hidden min-h-0">
        {(leftJson.trim() || rightJson.trim()) ? (
          <Alert variant={!comparison.left.isValid || !comparison.right.isValid ? "destructive" : "default"} className={`shrink-0 ${comparison.areEqual ? "bg-emerald-50 border-emerald-200 text-emerald-800" : ""}`}>
            {!comparison.left.isValid || !comparison.right.isValid ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <AlertTitle>{comparisonTitle}</AlertTitle>
            <AlertDescription>{comparisonDescription}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden min-h-0">
        <div className="flex flex-col h-full gap-3 overflow-hidden min-h-0">
          <div className="font-bold text-[11px] text-slate-400 uppercase tracking-widest shrink-0">Original JSON</div>
          <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
            <JsonEditor 
              value={leftJson}
              onChange={(value) => setLeftJson(value || "")}
            />
          </div>
        </div>
        <div className="flex flex-col h-full gap-3 overflow-hidden min-h-0">
          <div className="font-bold text-[11px] text-slate-400 uppercase tracking-widest shrink-0">Modified JSON</div>
          <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
            <JsonEditor 
              value={rightJson}
              onChange={(value) => setRightJson(value || "")}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
