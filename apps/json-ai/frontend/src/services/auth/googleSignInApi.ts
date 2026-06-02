import { setStoredSession } from "@/services/auth/session";
import { createAccessToken } from "@/services/auth/token";
import type { AuthSession } from "@/types/auth";

/**
 * Mock Google sign-in for the demo environment.
 * In production this would be replaced by a real Google OAuth flow
 * (e.g. NextAuth with the Google provider, or a server-side OAuth redirect).
 */
export async function googleSignInApi(): Promise<AuthSession> {
  // Simulate a brief network round-trip
  await new Promise<void>((resolve) => setTimeout(resolve, 600));

  const session: AuthSession = {
    user: {
      id: "google-demo-user",
      name: "Demo User",
      email: "demo@gmail.com",
      plan: "Free",
    },
    accessToken: createAccessToken("google-demo-user"),
  };

  setStoredSession(session);
  return session;
}
