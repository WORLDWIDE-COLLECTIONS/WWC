import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-aware Supabase client for Server Actions. Reads the auth session
 * from the request cookies and writes session changes back to the response,
 * so a successful sign-in actually reaches the browser and survives the
 * redirect. Server-only — never import this from a client component.
 */
export async function createAuthClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

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
          // Cookie writes are only allowed in Server Actions and Route
          // Handlers — both places this client is used from.
        }
      },
    },
  });
}
