"use client";

import ToolHeader from "@/components/shared/ToolHeader";
import JsonEditor from "@/components/editor/JsonEditor";
import CopyButton from "@/components/shared/CopyButton";
import DownloadButton from "@/components/shared/DownloadButton";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Minimize2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useJsonMinifier } from "@/hooks/useJsonMinifier";

export default function JsonMinifier() {
  const { input, setInput, error, minifyJson } = useJsonMinifier();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen w-full">
      <SEO title="JSON Minifier" description="Minify JSON quickly online." />
      <ToolHeader 
        title="JSON Minifier" 
        description="Compress and minify your JSON data."
        actions={
          <>
            <Button onClick={minifyJson} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 text-white border-transparent">
              <Minimize2 className="w-4 h-4" />
              Minify
            </Button>
            <CopyButton text={input} className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50" />
            <DownloadButton data={input} filename="minified.json" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50" />
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
