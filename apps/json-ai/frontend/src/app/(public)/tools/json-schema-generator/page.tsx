import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Schema Generator",
  description: "Generate JSON Schema from JSON.",
};

export { default } from "@/views/tools/JsonSchemaGenerator";