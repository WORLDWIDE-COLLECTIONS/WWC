import * as React from "react";

import { cn } from "@/lib/utils";

export function chipClassName(active = false) {
  return cn(
    "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
    active
      ? "border-ink bg-ink text-paper"
      : "border-line bg-transparent text-graphite hover:border-graphite/60 hover:text-ink",
  );
}

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Chip({ active = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(chipClassName(active), className)}
      {...props}
    />
  );
}

export function Separator({
  className,
  orientation = "horizontal",
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block shrink-0 bg-line",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
