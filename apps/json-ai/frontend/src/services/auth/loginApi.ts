import { getStoredAccounts, setStoredSession } from "@/services/auth/session";
import { createAccessToken } from "@/services/auth/token";
import type { AuthSession, LoginInput } from "@/types/auth";

export async function loginApi(input: LoginInput): Promise<AuthSession> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const account = getStoredAccounts().find(
    (item) => item.email.toLowerCase() === email && item.password === password,
  );

  if (!account) {
    throw new Error("Invalid email or password.");
  }

  const session: AuthSession = {
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      plan: account.plan,
    },
    accessToken: createAccessToken(account.id),
  };

  setStoredSession(session);
  return session;
}