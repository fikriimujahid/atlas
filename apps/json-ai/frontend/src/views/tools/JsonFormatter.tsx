"use client";

import ToolHeader from "@/components/shared/ToolHeader";
import JsonEditor from "@/components/editor/JsonEditor";
import CopyButton from "@/components/shared/CopyButton";
import DownloadButton from "@/components/shared/DownloadButton";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Wand2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useJsonFormatter } from "@/hooks/useJsonFormatter";

export default function JsonFormatter() {
  const { input, setInput, error, formatJson } = useJsonFormatter();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen w-full">
      <SEO title="JSON Formatter & Beautifier" description="Format, beautify, and validate your JSON data instantly." />
      <ToolHeader 
        title="JSON Formatter" 
        description="Format and beautify your JSON data."
        actions={
          <>
            <Button onClick={formatJson} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 text-white border-transparent">
              <Wand2 className="w-4 h-4" />
              Format
            </Button>
            <CopyButton text={input} className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50" />
            <DownloadButton data={input} filename="formatted.json" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50" />
          </>
        }
      />
      
      <div className="flex-1 p-6 pt-2 flex flex-col gap-4 overflow-hidden min-h-0">
        {error && (
          <Alert variant="destructive" className="shrink-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
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
