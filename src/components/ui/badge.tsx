import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeVariant = "solid" | "outline" | "accent" | "gilt" | "success";

const variants: Record<BadgeVariant, string> = {
  solid: "bg-ink text-paper border-ink",
  outline: "bg-chalk/90 text-ink border-ink/25 backdrop-blur-[2px]",
  accent: "bg-flare text-white border-flare",
  gilt: "bg-chalk/90 text-gilt border-gilt/50 backdrop-blur-[2px]",
  success: "bg-success/10 text-success border-success/30",
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  variant = "outline",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
