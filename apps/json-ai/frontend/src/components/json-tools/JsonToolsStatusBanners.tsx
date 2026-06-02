"use client";

import { CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";
import type { JsonComparisonResult, JsonValidationResult } from "@/types/tools";

interface JsonToolsStatusBannersProps {
  aiRepairLoading: boolean;
  compareResult: JsonComparisonResult;
  error: string | null;
  input: string;
  isCompare: boolean;
  isValidate: boolean;
  onAiRepair: () => void;
  rightInput: string;
  validation: JsonValidationResult;
}

export default function JsonToolsStatusBanners({
  aiRepairLoading,
  compareResult,
  error,
  input,
  isCompare,
  isValidate,
  onAiRepair,
  rightInput,
  validation,
}: JsonToolsStatusBannersProps) {
  return (
    <>
      {(error || (isValidate && input.trim())) && (
        <div
          className={`shrink-0 px-4 py-2 text-sm flex items-center gap-2 border-b ${
            error || !validation.isValid
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
          }`}
        >
          {error || !validation.isValid ? (
            <>
              <XCircle className="w-4 h-4 shrink-0" />
              <span className="font-mono text-xs flex-1">{error ?? validation.error}</span>
              <button
                onClick={onAiRepair}
                disabled={aiRepairLoading}
                className="ml-auto flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-destructive/30 hover:bg-destructive/20 transition-colors disabled:opacity-50"
              >
                {aiRepairLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                AI Fix
              </button>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">Valid JSON</span>
            </>
          )}
        </div>
      )}

      {isCompare && (input.trim() || rightInput.trim()) && (
        <div
          className={`shrink-0 px-4 py-2 text-sm flex items-center gap-2 border-b ${
            !compareResult.left.isValid || !compareResult.right.isValid
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : compareResult.areEqual
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
          }`}
        >
          {!compareResult.left.isValid ? (
            <>
              <XCircle className="w-4 h-4 shrink-0" />
              <span className="font-mono text-xs">Left: {compareResult.left.error}</span>
            </>
          ) : !compareResult.right.isValid ? (
            <>
              <XCircle className="w-4 h-4 shrink-0" />
              <span className="font-mono text-xs">Right: {compareResult.right.error}</span>
            </>
          ) : compareResult.areEqual ? (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">Payloads are identical</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">Payloads differ</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
