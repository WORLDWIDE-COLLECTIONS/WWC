import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 border border-danger/30 bg-chalk px-6 py-16 text-center",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-full bg-danger/10 text-danger">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M12 8v5m0 3h.01M10.3 3.9 2.5 17.5A1.97 1.97 0 0 0 4.2 20.4h15.6a1.97 1.97 0 0 0 1.7-2.9L13.7 3.9a1.97 1.97 0 0 0-3.4 0Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl">{title}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          {description}
        </p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
