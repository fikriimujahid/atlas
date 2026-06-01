"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SCHEMA_SAMPLE } from "@/constants/tools";
import { generateJsonSchemaString } from "@/services/tools/toolsApi";

export function useJsonSchemaGenerator() {
  const [input, setInput] = useState(SCHEMA_SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function generateSchema() {
    try {
      setOutput(generateJsonSchemaString(input));
      setError(null);
      toast.success("Schema generated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON input";
      setError(message);
      toast.error("Invalid JSON input");
    }
  }

  return { input, setInput, output, error, generateSchema };
}