import type { Metadata } from "next";
import Dashboard from "@/views/Dashboard";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your JSON-AI dashboard.",
};

export default function Page() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}