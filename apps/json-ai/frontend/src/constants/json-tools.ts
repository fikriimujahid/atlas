import {
  AlignLeft,
  ArrowLeftRight,
  CheckCircle2,
  Database,
  FileCode2,
  FileJson,
  Minimize2,
  Table,
} from "lucide-react";
import type { JsonTool, JsonToolTab } from "@/types/tools";

export const JSON_TOOL_TABS: JsonToolTab[] = [
  { id: "format", label: "Format", icon: AlignLeft, group: "core" },
  { id: "validate", label: "Validate", icon: CheckCircle2, group: "core" },
  { id: "minify", label: "Minify", icon: Minimize2, group: "core" },
  { id: "compare", label: "Compare", icon: ArrowLeftRight, group: "core" },
  { id: "schema", label: "Schema", icon: FileJson, group: "convert" },
  { id: "typescript", label: "TypeScript", icon: FileCode2, group: "convert" },
  { id: "sql", label: "SQL", icon: Database, group: "convert" },
  { id: "csv", label: "CSV", icon: Table, group: "convert" },
];

export const JSON_CONVERTER_TOOLS: JsonTool[] = ["schema", "typescript", "sql", "csv"];

export const JSON_TOOL_RUN_LABEL: Record<JsonTool, string> = {
  format: "Format",
  validate: "Validate",
  minify: "Minify",
  compare: "Compare",
  schema: "Generate Schema",
  typescript: "Generate Types",
  sql: "Generate SQL",
  csv: "Convert to CSV",
};

const JSON_TOOL_OUTPUT_FILENAME: Record<JsonTool, string> = {
  format: "formatted.json",
  validate: "input.json",
  minify: "minified.json",
  compare: "input.json",
  schema: "schema.json",
  typescript: "types.ts",
  sql: "data.sql",
  csv: "data.csv",
};

const JSON_TOOL_OUTPUT_LANGUAGE: Record<JsonTool, string> = {
  format: "json",
  validate: "json",
  minify: "json",
  compare: "json",
  schema: "json",
  typescript: "typescript",
  sql: "sql",
  csv: "plaintext",
};

export function getJsonToolOutputFilename(tool: JsonTool): string {
  return JSON_TOOL_OUTPUT_FILENAME[tool];
}

export function getJsonToolOutputLanguage(tool: JsonTool): string {
  return JSON_TOOL_OUTPUT_LANGUAGE[tool];
}
