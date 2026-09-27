import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="eyebrow flex items-center gap-1.5 text-graphite"
      >
        {label}
        {required ? <span className="text-flare">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export type TextFieldProps = Omit<
  InputPropsWithoutSize,
  "size" | "invalid" | "className"
> & {
  label: string;
  error?: string;
  hint?: string;
  inputSize?: "sm" | "md" | "lg";
  className?: string;
  inputClassName?: string;
};

type InputPropsWithoutSize = React.ComponentPropsWithoutRef<typeof Input>;

export function TextField({
  label,
  error,
  hint,
  inputSize = "md",
  className,
  inputClassName,
  id,
  required,
  ...props
}: TextFieldProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <Field
      label={label}
      htmlFor={inputId}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <Input
        id={inputId}
        size={inputSize}
        invalid={Boolean(error)}
        required={required}
        className={inputClassName}
        {...props}
      />
    </Field>
  );
}

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: React.ReactNode;
};

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "group inline-flex cursor-pointer items-center gap-3 text-sm text-ink",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="grid size-5 place-items-center border border-graphite/40 bg-chalk text-transparent transition-colors duration-200 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
      >
        <svg viewBox="0 0 12 12" className="size-3" fill="none">
          <path
            d="M2 6.5L4.8 9.2L10 3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </label>
  );
}
