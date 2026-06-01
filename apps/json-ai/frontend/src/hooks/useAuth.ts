"use client";

import { useContext } from "react";
import AuthProvider, { AuthContext } from "@/providers/AuthProvider";

void AuthProvider;

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}