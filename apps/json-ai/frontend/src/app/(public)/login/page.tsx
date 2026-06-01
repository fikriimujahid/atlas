import type { Metadata } from "next";
import { Suspense } from "react";
import Login from "@/views/auth/Login";

export const metadata: Metadata = {
  title: "Log In",
  description: "Sign in to your JSON-AI account.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-3.5rem)]" />}>
      <Login />
    </Suspense>
  );
}