"use client";

import ToolHeader from "@/components/shared/ToolHeader";
import JsonEditor from "@/components/editor/JsonEditor";
import SEO from "@/components/seo/SEO";
import { CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useJsonValidator } from "@/hooks/useJsonValidator";

export default function JsonValidator() {
  const { input, setInput, validation } = useJsonValidator();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen w-full">
      <SEO title="JSON Validator" description="Validate your JSON online." />
      <ToolHeader 
        title="JSON Validator" 
        description="Check if your JSON is perfectly valid and well-formed."
      />
      
      <div className="flex-1 p-6 pt-2 flex flex-col gap-4 overflow-hidden min-h-0">
        {input.trim() && (
          <Alert variant={validation.isValid ? "default" : "destructive"} className={`shrink-0 ${validation.isValid ? "bg-emerald-50 border-emerald-200 text-emerald-800" : ""}`}>
            {validation.isValid ? <CheckCircle2 className="h-4 w-4 !text-emerald-700" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>{validation.isValid ? "Valid JSON" : "Invalid JSON"}</AlertTitle>
            {!validation.isValid ? <AlertDescription className="font-mono text-xs mt-2 p-2 bg-red-50 dark:bg-red-900/10 rounded">{validation.error}</AlertDescription> : null}
          </Alert>
        )}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
          <JsonEditor 
            value={input}
            onChange={(value) => setInput(value || "")}
          />
        </div>
      </div>
    </div>
  );
}
