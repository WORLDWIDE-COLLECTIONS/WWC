import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "outline"
  | "ghost"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink-soft active:bg-ink border border-ink",
  accent:
    "bg-flare text-white hover:bg-flare/90 active:bg-flare border border-flare",
  outline:
    "bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink/[0.04]",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-bone",
  link: "bg-transparent text-ink border border-transparent underline underline-offset-4 hover:text-graphite px-0",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.65rem] tracking-[0.18em]",
  md: "h-11 px-6 text-[0.7rem] tracking-[0.2em]",
  lg: "h-14 px-8 text-[0.75rem] tracking-[0.2em]",
  icon: "h-11 w-11 p-0",
};

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = NativeButtonProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-none font-medium uppercase",
    "transition-[background-color,border-color,color,transform] duration-300 ease-editorial",
    "disabled:pointer-events-none disabled:opacity-40",
    variant !== "link" && "active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="size-3.5" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
