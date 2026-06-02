import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_CONTEXT = `You are JSON-AI, an expert JSON assistant embedded in a developer tool.
You help users fix broken JSON, explain JSON payloads in plain English, generate JSON from descriptions, and enhance generated schemas or TypeScript types.
Always respond concisely. When producing JSON output, return only valid JSON with no markdown fences unless the user explicitly asks for explanation alongside it.
When asked to fix JSON, return ONLY the corrected JSON with no extra commentary.
When asked to explain, give a brief plain-English summary.
When asked to generate JSON, return only the JSON object.`;

type Action = "repair" | "explain" | "chat" | "generate" | "enhance";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  action: Action;
  json?: string;
  prompt?: string;
  tool?: string;
  messages?: ChatMessage[];
}

function buildPrompt(body: RequestBody): string {
  switch (body.action) {
    case "repair":
      return `Fix this invalid JSON and return only the corrected JSON:\n\n${body.json}`;

    case "explain":
      return `Explain this JSON payload in 2–4 concise sentences, mentioning key fields and what it likely represents:\n\n${body.json}`;

    case "generate":
      return `Generate a realistic JSON object based on this description: "${body.prompt}". Return only valid JSON.`;

    case "enhance":
      return `The user is working with the "${body.tool}" tool. Enhance or improve this output by adding descriptive comments, tightening types, or identifying obvious semantic hints (e.g. email format, ISO dates). Return only the improved output:\n\n${body.json}`;

    case "chat": {
      const history = (body.messages ?? [])
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");
      const contextNote = body.json?.trim()
        ? `\n\nCurrent JSON in the editor (use as context for your answer):\n${body.json}`
        : "";
      return `${history}${contextNote}`;
    }
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validActions: Action[] = ["repair", "explain", "chat", "generate", "enhance"];
  if (!validActions.includes(body.action)) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(body);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
        { role: "model", parts: [{ text: "Understood. I am ready to help with JSON tasks." }] },
        { role: "user", parts: [{ text: prompt }] },
      ],
    });

    const result = response.text ?? "";
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
