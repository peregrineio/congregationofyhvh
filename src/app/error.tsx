"use client";

import { GoldButton } from "@/components/ui/gold-button";
import { AlertCircle } from "@/components/icons";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <AlertCircle className="size-12 text-destructive/60 mx-auto" />
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Something Went Wrong
        </h1>
        <p className="font-body text-base text-muted-foreground max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again.
        </p>
        <GoldButton onClick={reset}>Try Again</GoldButton>
      </div>
    </div>
  );
}
