import type { JsonComparisonResult, JsonValidationResult } from "@/types/tools";

function parseJson(input: string) {
  if (!input.trim()) {
    throw new Error("Please enter JSON first.");
  }

  return JSON.parse(input) as unknown;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sortJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }

  if (isPlainObject(value)) {
    return Object.keys(value)
      .sort((left, right) => left.localeCompare(right))
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = sortJsonValue(value[key]);
        return result;
      }, {});
  }

  return value;
}

function stableStringify(value: unknown, space = 2) {
  return JSON.stringify(sortJsonValue(value), null, space);
}

function toPascalCase(value: string) {
  const result = value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

  return result || "RootObject";
}

function toIdentifier(value: string) {
  const normalized = value.replace(/[^a-zA-Z0-9_]/g, "_");

  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(normalized)) {
    return normalized;
  }

  return JSON.stringify(value);
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function inferSchema(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: "array", items: {} };
    }

    const itemSchemas = value.map((item) => inferSchema(item));
    const uniqueSchemas = unique(itemSchemas.map((item) => JSON.stringify(item))).map((item) => JSON.parse(item) as Record<string, unknown>);

    return {
      type: "array",
      items: uniqueSchemas.length === 1 ? uniqueSchemas[0] : { anyOf: uniqueSchemas },
    };
  }

  if (value === null) {
    return { type: "null" };
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);

    return {
      type: "object",
      properties: entries.reduce<Record<string, unknown>>((result, [key, nestedValue]) => {
        result[key] = inferSchema(nestedValue);
        return result;
      }, {}),
      required: entries.map(([key]) => key),
      additionalProperties: false,
    };
  }

  if (typeof value === "string") {
    return { type: "string" };
  }

  if (typeof value === "number") {
    return { type: Number.isInteger(value) ? "integer" : "number" };
  }

  if (typeof value === "boolean") {
    return { type: "boolean" };
  }

  return { type: "string" };
}

function inferTypeScriptType(value: unknown, name: string, declarations: Map<string, string>): string {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "unknown[]";
    }

    const itemTypes = unique(value.map((item) => inferTypeScriptType(item, `${name}Item`, declarations)));
    const union = itemTypes.length === 1 ? itemTypes[0] : itemTypes.join(" | ");
    return `Array<${union}>`;
  }

  if (value === null) {
    return "null";
  }

  if (isPlainObject(value)) {
    const interfaceName = toPascalCase(name);

    if (!declarations.has(interfaceName)) {
      declarations.set(interfaceName, "");

      const properties = Object.entries(value)
        .map(([key, nestedValue]) => `  ${toIdentifier(key)}: ${inferTypeScriptType(nestedValue, `${interfaceName}${toPascalCase(key)}`, declarations)};`)
        .join("\n");

      declarations.set(interfaceName, `export interface ${interfaceName} {\n${properties}\n}`);
    }

    return interfaceName;
  }

  if (typeof value === "string") {
    return "string";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (typeof value === "boolean") {
    return "boolean";
  }

  return "unknown";
}

function normalizeRows(value: unknown) {
  const rows = Array.isArray(value) ? value : [value];

  if (!rows.length || rows.some((item) => !isPlainObject(item))) {
    throw new Error("Input must be an object or an array of objects.");
  }

  return rows as Record<string, unknown>[];
}

function sanitizeSqlIdentifier(value: string) {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
  return normalized || "column_name";
}

function inferSqlType(values: unknown[]) {
  const candidate = values.find((value) => value !== null && value !== undefined);

  if (candidate === undefined) {
    return "TEXT";
  }

  if (typeof candidate === "boolean") {
    return "BOOLEAN";
  }

  if (typeof candidate === "number") {
    return Number.isInteger(candidate) ? "INTEGER" : "DOUBLE PRECISION";
  }

  if (typeof candidate === "string") {
    return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(candidate) ? "TIMESTAMP" : "TEXT";
  }

  if (Array.isArray(candidate) || isPlainObject(candidate)) {
    return "JSONB";
  }

  return "TEXT";
}

function toSqlValue(value: unknown) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  if (typeof value === "string") {
    return `'${value.replace(/'/g, "''")}'`;
  }

  return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
}

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = typeof value === "string" ? value : JSON.stringify(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function formatJsonString(input: string) {
  return JSON.stringify(parseJson(input), null, 2);
}

export function minifyJsonString(input: string) {
  return JSON.stringify(parseJson(input));
}

export function validateJsonString(input: string): JsonValidationResult {
  if (!input.trim()) {
    return { isValid: true, error: null };
  }

  try {
    parseJson(input);
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

export function compareJsonStrings(leftInput: string, rightInput: string): JsonComparisonResult {
  const left = validateJsonString(leftInput);
  const right = validateJsonString(rightInput);

  if (!left.isValid || !right.isValid || !leftInput.trim() || !rightInput.trim()) {
    return {
      left,
      right,
      areEqual: null,
    };
  }

  return {
    left,
    right,
    areEqual: stableStringify(parseJson(leftInput)) === stableStringify(parseJson(rightInput)),
  };
}

export function generateJsonSchemaString(input: string) {
  const parsed = parseJson(input);
  return JSON.stringify(
    {
      $schema: "http://json-schema.org/draft-07/schema#",
      ...inferSchema(parsed),
    },
    null,
    2,
  );
}

export function generateTypeScriptString(input: string) {
  const parsed = parseJson(input);
  const declarations = new Map<string, string>();
  const rootType = inferTypeScriptType(parsed, "RootObject", declarations);
  const lines: string[] = [];

  if (rootType === "RootObject" && declarations.has("RootObject")) {
    lines.push(...declarations.values());
  } else {
    lines.push(`export type RootObject = ${rootType};`);

    if (declarations.size > 0) {
      lines.push("", ...declarations.values());
    }
  }

  return lines.join("\n");
}

export function generateSqlString(input: string) {
  const rows = normalizeRows(parseJson(input));
  const columns = unique(rows.flatMap((row) => Object.keys(row)));

  const columnDefinitions = columns.map((column) => {
    const values = rows.map((row) => row[column]);
    return `  ${sanitizeSqlIdentifier(column)} ${inferSqlType(values)}`;
  });

  const insertRows = rows.map((row) => {
    const values = columns.map((column) => toSqlValue(row[column])).join(", ");
    return `(${values})`;
  });

  return [
    "CREATE TABLE json_data (",
    columnDefinitions.join(",\n"),
    ");",
    "",
    `INSERT INTO json_data (${columns.map((column) => sanitizeSqlIdentifier(column)).join(", ")}) VALUES`,
    `${insertRows.join(",\n")};`,
  ].join("\n");
}

export function generateCsvString(input: string) {
  const rows = normalizeRows(parseJson(input));
  const columns = unique(rows.flatMap((row) => Object.keys(row)));
  const header = columns.join(",");
  const dataRows = rows.map((row) => columns.map((column) => escapeCsvValue(row[column])).join(","));

  return [header, ...dataRows].join("\n");
}