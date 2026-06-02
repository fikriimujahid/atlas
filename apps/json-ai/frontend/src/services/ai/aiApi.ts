export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AiResponse {
  result: string;
}

async function callAiRoute(body: object): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as AiResponse & { error?: string };

  if (!res.ok || data.error) {
    throw new Error(data.error ?? "AI request failed.");
  }

  return data.result;
}

export function repairJson(brokenJson: string): Promise<string> {
  return callAiRoute({ action: "repair", json: brokenJson });
}

export function explainJson(json: string): Promise<string> {
  return callAiRoute({ action: "explain", json });
}

export function generateJson(description: string): Promise<string> {
  return callAiRoute({ action: "generate", prompt: description });
}

export function enhanceOutput(json: string, tool: string): Promise<string> {
  return callAiRoute({ action: "enhance", json, tool });
}

export function chatWithJson(messages: AiChatMessage[], currentJson: string): Promise<string> {
  return callAiRoute({ action: "chat", messages, json: currentJson });
}
