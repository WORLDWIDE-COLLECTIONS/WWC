import * as React from "react";

import { cn } from "@/lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8 md:p-10",
};

export function Card({
  interactive = false,
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "border border-line bg-chalk",
        paddings[padding],
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-300 ease-editorial hover:-translate-y-1 hover:border-ink/30 hover:shadow-lift",
        className,
      )}
      {...props}
    />
  );
}
