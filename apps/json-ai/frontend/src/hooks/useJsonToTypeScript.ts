"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TYPESCRIPT_SAMPLE } from "@/constants/tools";
import { generateTypeScriptString } from "@/services/tools/toolsApi";

export function useJsonToTypeScript() {
  const [input, setInput] = useState(TYPESCRIPT_SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function transform() {
    try {
      setOutput(generateTypeScriptString(input));
      setError(null);
      toast.success("TypeScript generated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setError(message);
      toast.error("Failed to generate TypeScript");
    }
  }

  return { input, setInput, output, error, transform };
}