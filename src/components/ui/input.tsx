import * as React from "react";

import { cn } from "@/lib/utils";

const base =
  "w-full rounded-none border border-line bg-chalk px-4 text-sm text-ink " +
  "transition-colors duration-200 placeholder:text-muted/70 " +
  "hover:border-graphite/40 focus:border-ink focus:outline-none " +
  "disabled:cursor-not-allowed disabled:bg-bone disabled:text-muted";

const heights = {
  sm: "h-9 text-xs",
  md: "h-11",
  lg: "h-13 text-base",
} as const;

export type ControlSize = keyof typeof heights;

type SizeProp = { size?: ControlSize };
type InvalidProp = { invalid?: boolean };

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> &
  SizeProp &
  InvalidProp;

export function Input({
  size = "md",
  invalid,
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        base,
        heights[size],
        invalid && "border-danger focus:border-danger",
        className,
      )}
      {...props}
    />
  );
}

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> &
  SizeProp &
  InvalidProp;

export function Textarea({
  size = "md",
  invalid,
  className,
  rows = 5,
  ...props
}: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        base,
        "h-auto resize-y py-3 leading-relaxed",
        size === "lg" && "text-base",
        invalid && "border-danger focus:border-danger",
        className,
      )}
      {...props}
    />
  );
}

const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%230b0b0c' stroke-width='1.5'/%3E%3C/svg%3E\")";

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> &
  SizeProp &
  InvalidProp;

export function Select({
  size = "md",
  invalid,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={cn(
        base,
        heights[size],
        "appearance-none pr-10",
        invalid && "border-danger focus:border-danger",
        className,
      )}
      style={{
        backgroundImage: selectChevron,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        backgroundSize: "0.75rem",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
