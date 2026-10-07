"use client";

import * as React from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { signIn } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function AdminLoginForm({ next }: { next?: string }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, formAction, pending] = React.useActionState(signIn, {
    error: null,
  });

  return (
    <form className="flex w-full max-w-sm flex-col gap-6" action={formAction}>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="flex flex-col gap-3">
        <p className="eyebrow text-gilt">Sign in</p>
        <h2 className="display-3">Admin access</h2>
        <p className="text-sm leading-relaxed text-muted">
          Credentials are verified against Supabase Auth.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Field label="Email" htmlFor="admin-email" required>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@worldwidecollection.com"
              required
              className="pl-11"
            />
          </div>
        </Field>

        <Field
          label="Password"
          htmlFor="admin-password"
          required
          error={state.error ?? undefined}
        >
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <Input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className="pl-11 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-muted transition-colors hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>
      </div>

      <Button size="lg" type="submit" className="w-full" loading={pending}>
        Sign in
      </Button>

      {!isSupabaseConfigured() ? (
        <p className="text-center text-xs leading-relaxed text-muted">
          Sign-in activates once Supabase credentials are configured in
          <span className="text-ink"> .env.local</span>.
        </p>
      ) : null}
    </form>
  );
}
