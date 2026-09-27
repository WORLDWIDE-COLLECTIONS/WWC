const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseUrl() {
  return SUPABASE_URL && SUPABASE_URL.length > 0 ? SUPABASE_URL : undefined;
}

export function getAnonKey() {
  return SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 0
    ? SUPABASE_ANON_KEY
    : undefined;
}

export function getServiceRoleKey() {
  return SUPABASE_SERVICE_ROLE_KEY && SUPABASE_SERVICE_ROLE_KEY.length > 0
    ? SUPABASE_SERVICE_ROLE_KEY
    : undefined;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getAnonKey());
}
