import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI JSON Assistant",
  description: "Talk to an AI to fix, explain, or generate JSON payloads.",
};

export { default } from "@/views/ai/AiChat";