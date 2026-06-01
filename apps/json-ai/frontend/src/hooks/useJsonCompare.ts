"use client";

import { useState } from "react";
import { COMPARE_LEFT_SAMPLE, COMPARE_RIGHT_SAMPLE } from "@/constants/tools";
import { compareJsonStrings } from "@/services/tools/toolsApi";

export function useJsonCompare() {
  const [leftJson, setLeftJson] = useState(COMPARE_LEFT_SAMPLE);
  const [rightJson, setRightJson] = useState(COMPARE_RIGHT_SAMPLE);
  const comparison = compareJsonStrings(leftJson, rightJson);

  return { leftJson, setLeftJson, rightJson, setRightJson, comparison };
}