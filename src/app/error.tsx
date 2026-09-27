"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-1 items-center justify-center py-24">
      <ErrorState
        title="This page hit a snag"
        description="Something broke while rendering. Retry, or head back to the storefront."
        onRetry={reset}
        className="max-w-xl"
      />
    </div>
  );
}
