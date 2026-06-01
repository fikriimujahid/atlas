"use client";

import { useState } from "react";
import { VALIDATOR_SAMPLE } from "@/constants/tools";
import { validateJsonString } from "@/services/tools/toolsApi";

export function useJsonValidator() {
  const [input, setInput] = useState(VALIDATOR_SAMPLE);
  const validation = validateJsonString(input);

  return { input, setInput, validation };
}