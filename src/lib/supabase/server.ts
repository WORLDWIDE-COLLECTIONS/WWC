import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import {
  getAnonKey,
  getServiceRoleKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

export async function createClient() {
  const url = getSupabaseUrl();
  const anonKey = getAnonKey();

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Copy .env.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component; proxy refreshes sessions.
        }
      },
    },
  });
}

/** Cookie-aware client, or null when Supabase is not configured yet. */
export async function maybeCreateClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}

/**
 * Server-only client with the service role key. Bypasses RLS — callers must
 * verify an admin session first. Returns null when the key is not configured.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const serviceRoleKey = getServiceRoleKey();

  if (!url || !serviceRoleKey) return null;

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
