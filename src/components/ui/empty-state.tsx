import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  variant?: "default" | "compact";
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const compact = variant === "compact";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border border-line bg-chalk/70 text-center",
        compact ? "gap-4 px-6 py-12" : "gap-6 px-6 py-20 md:py-28",
        className,
      )}
    >
      <span className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px w-8 bg-gilt/50" />
        {icon ? <span className="text-gilt">{icon}</span> : <span className="text-gilt">✦</span>}
        <span className="h-px w-8 bg-gilt/50" />
      </span>

      <div className="flex flex-col items-center gap-3">
        <h3 className={compact ? "font-display text-xl" : "display-3"}>
          {title}
        </h3>
        {description ? (
          <p
            className={cn(
              "max-w-md text-muted",
              compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Button
          href={action.href}
          variant="outline"
          size={compact ? "sm" : "md"}
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
