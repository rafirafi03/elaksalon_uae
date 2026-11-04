import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { logAdminError } from "@/lib/messages";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/reset-password";
}

/**
 * Landing URL for links in Supabase auth emails (password reset).
 * Supports both the token_hash template (works in any browser) and the PKCE ?code= flow.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  let ok = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getAdminSupabase();
      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
        if (error) logAdminError("auth.verifyOtp", error.message);
        ok = !error;
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) logAdminError("auth.exchangeCode", error.message);
        ok = !error;
      }
    } catch (error) {
      logAdminError("auth.confirm", error);
    }
  }

  return NextResponse.redirect(new URL(ok ? next : "/login?error=link", url.origin));
}
