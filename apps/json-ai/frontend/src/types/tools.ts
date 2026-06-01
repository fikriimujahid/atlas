import type { LucideIcon } from "lucide-react";

export interface ToolNavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface JsonValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface JsonComparisonResult {
  left: JsonValidationResult;
  right: JsonValidationResult;
  areEqual: boolean | null;
}