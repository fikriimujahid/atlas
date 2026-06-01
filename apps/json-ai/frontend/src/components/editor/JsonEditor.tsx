import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";

const Editor = dynamic(
  () => import("@monaco-editor/react").then((module) => module.default),
  {
    ssr: false,
    loading: () => <div className="h-full min-h-[400px] w-full bg-slate-950" />,
  },
);

interface JsonEditorProps extends Omit<EditorProps, "onChange"> {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
}

export default function JsonEditor({ value, onChange, language = "json", readOnly = false, ...props }: JsonEditorProps) {
  return (
    <div className="w-full flex-1 min-h-[400px] border rounded-md overflow-hidden relative">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          readOnly,
          formatOnPaste: true,
          ...props.options
        }}
        {...props}
      />
    </div>
  );
}
