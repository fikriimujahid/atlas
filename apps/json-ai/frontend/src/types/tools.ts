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

export type JsonTool = "format" | "validate" | "minify" | "compare" | "schema" | "typescript" | "sql" | "csv";

export type JsonToolsSidebarTab = "saved" | "history";

export type JsonToolsAuthFeature = "ai" | "save";

export interface JsonToolTab {
  id: JsonTool;
  label: string;
  icon: LucideIcon;
  group: "core" | "convert";
}

export interface JsonSnippet {
  id: string;
  label: string;
  tool: JsonTool;
  content: string;
  savedAt: Date;
}