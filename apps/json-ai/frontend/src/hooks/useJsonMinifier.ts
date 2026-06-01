"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MINIFIER_SAMPLE } from "@/constants/tools";
import { minifyJsonString } from "@/services/tools/toolsApi";

export function useJsonMinifier() {
  const [input, setInput] = useState(MINIFIER_SAMPLE);
  const [error, setError] = useState<string | null>(null);

  function minifyJson() {
    try {
      const nextValue = minifyJsonString(input);
      setInput(nextValue);
      setError(null);
      toast.success("JSON minified successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setError(message);
      toast.error("Failed to minify JSON");
    }
  }

  return { input, setInput, error, minifyJson };
}