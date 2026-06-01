"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SQL_SAMPLE } from "@/constants/tools";
import { generateSqlString } from "@/services/tools/toolsApi";

export function useJsonToSql() {
  const [input, setInput] = useState(SQL_SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function transform() {
    try {
      setOutput(generateSqlString(input));
      setError(null);
      toast.success("SQL generated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setError(message);
      toast.error("Failed to generate SQL");
    }
  }

  return { input, setInput, output, error, transform };
}