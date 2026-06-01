import { clearStoredSession } from "@/services/auth/session";

export async function logoutApi() {
  clearStoredSession();
}