"use client";

import ToolHeader from "@/components/shared/ToolHeader";
import JsonEditor from "@/components/editor/JsonEditor";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useJsonToTypeScript } from "@/hooks/useJsonToTypeScript";

export default function JsonToTypeScript() {
  const { input, setInput, output, error, transform } = useJsonToTypeScript();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen w-full">
      <SEO title="JSON to TypeScript Interfaces" description="Generate TS interfaces from JSON objects." />
      <ToolHeader 
        title="JSON to TypeScript" 
        description="Convert your JSON to TypeScript interfaces."
        actions={
          <Button onClick={transform} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 text-white border-transparent">
            <Wand2 className="w-4 h-4" /> Generate
          </Button>
        }
      />
      <div className="flex-1 p-6 pt-2 flex flex-col gap-4 overflow-hidden min-h-0">
        {error ? (
          <Alert variant="destructive" className="shrink-0">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden min-h-0">
        <div className="flex flex-col h-full gap-3 overflow-hidden min-h-0">
          <div className="font-bold text-[11px] text-slate-400 uppercase tracking-widest shrink-0">Input JSON</div>
          <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
            <JsonEditor value={input} onChange={(value) => setInput(value || "")} />
          </div>
        </div>
        <div className="flex flex-col h-full gap-3 overflow-hidden min-h-0">
          <div className="font-bold text-[11px] text-slate-400 uppercase tracking-widest shrink-0">TypeScript Output</div>
          <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
            <JsonEditor value={output} language="typescript" readOnly />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
