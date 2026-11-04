"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database, ElakSupabaseClient } from "@elak/db";
import { supabaseKey, supabaseUrl } from "@/lib/supabase-env";

/** Browser Supabase client (publishable key + auth cookies). For client-side reads/auth only. */
export function getBrowserSupabase(): ElakSupabaseClient {
  return createBrowserClient<Database>(supabaseUrl()!, supabaseKey()!);
}
