import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to CSV Converter",
  description: "Convert JSON arrays into CSV.",
};

export { default } from "@/views/tools/JsonToCsv";