import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database, ElakSupabaseClient } from "@elak/db";
import { supabaseKey, supabaseUrl } from "@/lib/supabase-env";

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseKey());
}

/**
 * Server Supabase client bound to the signed-in user's auth cookies.
 * Every query runs as that user, so Row Level Security decides what is allowed.
 * Use in Server Components, Server Actions and Route Handlers.
 */
export async function getAdminSupabase(): Promise<ElakSupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl()!, supabaseKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component (read-only cookies). The proxy refreshes the session instead.
        }
      },
    },
  });
}
