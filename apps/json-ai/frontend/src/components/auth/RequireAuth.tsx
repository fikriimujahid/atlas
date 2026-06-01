"use client";

import { useEffect, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeNextPath } from "@/services/auth/session";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      const nextPath = sanitizeNextPath(pathname);
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [pathname, router, status]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Checking your session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}