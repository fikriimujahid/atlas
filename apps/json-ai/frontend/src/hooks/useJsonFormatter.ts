"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FORMATTER_SAMPLE } from "@/constants/tools";
import { formatJsonString } from "@/services/tools/toolsApi";

export function useJsonFormatter() {
  const [input, setInput] = useState(FORMATTER_SAMPLE);
  const [error, setError] = useState<string | null>(null);

  function formatJson() {
    try {
      const nextValue = formatJsonString(input);
      setInput(nextValue);
      setError(null);
      toast.success("JSON formatted successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setError(message);
      toast.error("Failed to format JSON");
    }
  }

  return { input, setInput, error, formatJson };
}