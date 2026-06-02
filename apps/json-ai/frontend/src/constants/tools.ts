import {
  AlignLeft,
  ArrowLeftRight,
  CheckSquare,
  Database,
  FileCode2,
  FileJson,
  Minimize2,
  Table,
} from "lucide-react";
import type { ToolNavItem } from "@/types/tools";

export const TOOLS: ToolNavItem[] = [
  { name: "Formatter", path: "/json-tools", icon: AlignLeft },
  { name: "Validator", path: "/json-tools", icon: CheckSquare },
  { name: "Minifier", path: "/json-tools", icon: Minimize2 },
  { name: "Compare", path: "/json-tools", icon: ArrowLeftRight },
];

export const GENERATORS: ToolNavItem[] = [
  { name: "Schema Generator", path: "/json-tools", icon: FileJson },
  { name: "To TypeScript", path: "/json-tools", icon: FileCode2 },
  { name: "To SQL", path: "/json-tools", icon: Database },
  { name: "To CSV", path: "/json-tools", icon: Table },
];

export const FORMATTER_SAMPLE = '{\n  "example": "data"\n}';
export const VALIDATOR_SAMPLE = FORMATTER_SAMPLE;
export const MINIFIER_SAMPLE = FORMATTER_SAMPLE;
export const COMPARE_LEFT_SAMPLE = '{\n  "version": 1,\n  "enabled": true\n}';
export const COMPARE_RIGHT_SAMPLE = '{\n  "version": 2,\n  "enabled": true\n}';
export const SCHEMA_SAMPLE = '{\n  "name": "John Doe",\n  "age": 30,\n  "tags": ["admin", "editor"]\n}';
export const TYPESCRIPT_SAMPLE = '{\n  "id": 1,\n  "title": "Example",\n  "published": true\n}';
export const SQL_SAMPLE = '[{"id":1,"name":"Alice","active":true},{"id":2,"name":"Bob","active":false}]';
export const CSV_SAMPLE = '[{"name":"Alice","age":30},{"name":"Bob","age":25}]';