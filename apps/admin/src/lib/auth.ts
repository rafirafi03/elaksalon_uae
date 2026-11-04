import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const NOT_AUTHORIZED = "You are not authorized to perform this action. Please sign in again.";

/** Verified current user id (JWT checked via getClaims), or null. */
export async function getUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await getAdminSupabase();
  const { data } = await supabase.auth.getClaims();
  return (data?.claims?.sub as string | undefined) ?? null;
}

/** True when the signed-in user is listed in public.admins. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  if (!(await getUserId())) return false;
  const supabase = await getAdminSupabase();
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

/** Use at the top of every mutating Server Action. RLS enforces this too (defense in depth). */
export async function assertAdmin(): Promise<{ error?: string }> {
  return (await isCurrentUserAdmin()) ? {} : { error: NOT_AUTHORIZED };
}
