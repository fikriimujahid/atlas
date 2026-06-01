"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/providers/AuthProvider";
import BaseLayout from "@/components/layout/BaseLayout";
import { Toaster } from "@/components/ui/sonner";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BaseLayout>
        {children}
        <Toaster />
      </BaseLayout>
    </AuthProvider>
  );
}