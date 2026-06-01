import type { AuthSession, StoredAccount } from "@/types/auth";

const SESSION_STORAGE_KEY = "json-ai.auth.session";
const ACCOUNT_STORAGE_KEY = "json-ai.auth.accounts";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readStorage<T>(key: string): T | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredSession() {
  return readStorage<AuthSession>(SESSION_STORAGE_KEY);
}

export function setStoredSession(session: AuthSession) {
  writeStorage(SESSION_STORAGE_KEY, session);
}

export function clearStoredSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getStoredAccounts() {
  return readStorage<StoredAccount[]>(ACCOUNT_STORAGE_KEY) ?? [];
}

export function setStoredAccounts(accounts: StoredAccount[]) {
  writeStorage(ACCOUNT_STORAGE_KEY, accounts);
}

export function sanitizeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}