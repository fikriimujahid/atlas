import { getStoredAccounts, setStoredAccounts, setStoredSession } from "@/services/auth/session";
import { createAccessToken } from "@/services/auth/token";
import type { AuthSession, RegisterInput, StoredAccount } from "@/types/auth";

export async function registerApi(input: RegisterInput): Promise<AuthSession> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  const accounts = getStoredAccounts();
  const existingAccount = accounts.find((item) => item.email.toLowerCase() === email);

  if (existingAccount) {
    throw new Error("An account with that email already exists.");
  }

  const account: StoredAccount = {
    id: `user_${Date.now().toString(36)}`,
    name,
    email,
    password,
    plan: "Free",
  };

  setStoredAccounts([...accounts, account]);

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