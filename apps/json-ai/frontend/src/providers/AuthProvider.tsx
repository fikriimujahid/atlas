"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { loginApi } from "@/services/auth/loginApi";
import { logoutApi } from "@/services/auth/logoutApi";
import { registerApi } from "@/services/auth/registerApi";
import { getStoredSession } from "@/services/auth/session";
import type { AuthContextValue, AuthSession, AuthStatus, LoginInput, RegisterInput } from "@/types/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

function applySession(session: AuthSession | null) {
  if (!session) {
    return {
      user: null,
      accessToken: null,
      status: "unauthenticated" as AuthStatus,
    };
  }

  return {
    user: session.user,
    accessToken: session.accessToken,
    status: "authenticated" as AuthStatus,
  };
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthSession["user"] | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const session = getStoredSession();
    const nextState = applySession(session);

    setUser(nextState.user);
    setAccessToken(nextState.accessToken);
    setStatus(nextState.status);
  }, []);

  async function login(input: LoginInput) {
    const session = await loginApi(input);
    const nextState = applySession(session);

    setUser(nextState.user);
    setAccessToken(nextState.accessToken);
    setStatus(nextState.status);
  }

  async function register(input: RegisterInput) {
    const session = await registerApi(input);
    const nextState = applySession(session);

    setUser(nextState.user);
    setAccessToken(nextState.accessToken);
    setStatus(nextState.status);
  }

  async function logout() {
    await logoutApi();
    const nextState = applySession(null);

    setUser(nextState.user);
    setAccessToken(nextState.accessToken);
    setStatus(nextState.status);
  }

  return (
    <AuthContext.Provider value={{ status, user, accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}