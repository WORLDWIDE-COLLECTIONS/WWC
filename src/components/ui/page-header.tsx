import * as React from "react";

import { cn } from "@/lib/utils";

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 border-b border-line pb-8 md:pb-10",
        align === "center" && "items-center border-b-0 pb-0 text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow text-gilt">{eyebrow}</p> : null}
      <div
        className={cn(
          "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
          align === "center" && "items-center text-center",
        )}
      >
        <div className="flex flex-col gap-4">
          <h1 className="display-2">{title}</h1>
          {description ? (
            <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
