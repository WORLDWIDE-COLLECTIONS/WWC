import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

import { getAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";

const PRODUCT_SELECT =
  "*, images:product_images(*), sizes:product_sizes(*), colors:product_colors(*)";

let client: SupabaseClient | null | undefined;

/**
 * Stateless anon client for public catalogue reads. Returns null until
 * NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are configured so
 * the storefront keeps rendering empty states instead of crashing.
 */
export function getPublicClient(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = getSupabaseUrl();
  const anonKey = getAnonKey();

  client =
    url && anonKey
      ? createSupabaseClient(url, anonKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;

  return client;
}

export { PRODUCT_SELECT, isSupabaseConfigured };
