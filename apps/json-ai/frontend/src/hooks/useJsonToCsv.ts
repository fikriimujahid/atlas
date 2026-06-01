"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CSV_SAMPLE } from "@/constants/tools";
import { generateCsvString } from "@/services/tools/toolsApi";

export function useJsonToCsv() {
  const [input, setInput] = useState(CSV_SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function transform() {
    try {
      setOutput(generateCsvString(input));
      setError(null);
      toast.success("CSV generated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setError(message);
      toast.error("Failed to generate CSV");
    }
  }

  return { input, setInput, output, error, transform };
}