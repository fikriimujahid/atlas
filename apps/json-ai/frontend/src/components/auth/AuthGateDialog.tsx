"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Sparkles, Save, LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AuthGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What triggered the gate — shown in the heading */
  feature: "ai" | "save" | "login";
  /** Called after successful sign-in */
  onSuccess?: () => void;
}

const FEATURE_COPY = {
  ai: {
    icon: Sparkles,
    title: "Sign in to use AI features",
    description:
      "AI repair, explanation, generation, and the AI chat panel require a Google account.",
  },
  save: {
    icon: Save,
    title: "Sign in to save snippets",
    description:
      "Save and manage your JSON snippets across sessions by signing in with Google.",
  },
  login: {
    icon: LogIn,
    title: "Welcome back",
    description:
      "Sign in with your Google account to save snippets, use AI features, and more.",
  },
} as const;

export default function AuthGateDialog({
  open,
  onOpenChange,
  feature,
  onSuccess,
}: AuthGateDialogProps) {
  const { googleSignIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const { icon: Icon, title, description } = FEATURE_COPY[feature];

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      await googleSignIn();
      toast.success("Signed in successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium shadow-sm hover:bg-muted transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            By signing in you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
