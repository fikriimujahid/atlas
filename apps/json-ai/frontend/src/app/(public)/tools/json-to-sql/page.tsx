import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to SQL Generator",
  description: "Convert JSON arrays into SQL.",
};

export { default } from "@/views/tools/JsonToSql";