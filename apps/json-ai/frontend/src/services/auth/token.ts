export function createAccessToken(userId: string) {
  return `json-ai_${userId}_${Date.now().toString(36)}`;
}