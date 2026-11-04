import { createBrowserSupabaseClient, type ElakSupabaseClient } from "@elak/db";

/** Public (anon / publishable key) client. Returns null when env vars are missing. */
export function getPublicSupabase(): ElakSupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createBrowserSupabaseClient(url, anon);
}
