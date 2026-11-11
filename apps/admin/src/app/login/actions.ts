"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { logAdminError } from "@/lib/messages";
import { authErrorMessage, validateNewPassword } from "@/lib/password";

export type LoginState = { error?: string };

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/login") ? next : "/";
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not configured." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Please enter your email and password." };

  const supabase = await getAdminSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    logAdminError("auth.signIn", error.message);
    return { error: "Invalid email or password." };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || isAdmin !== true) {
    if (adminError) logAdminError("auth.isAdmin", adminError);
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await getAdminSupabase();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export type PasswordFormState = { error?: string; success?: string };

/** Base URL of the admin app for links in emails. */
async function adminOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const isLocal = (url: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(url);
  // Use the configured URL, but never a localhost one in production (a copied dev value).
  if (fromEnv && !(process.env.NODE_ENV === "production" && isLocal(fromEnv))) return fromEnv;

  // Otherwise use the address this request actually came to (works behind Vercel's proxy).
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) return `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}`;
  return h.get("origin") ?? fromEnv ?? "";
}

/** Sends a password reset email. Always answers the same way so emails can't be probed. */
export async function requestPasswordReset(
  _prev: PasswordFormState,
  formData: FormData,
): Promise<PasswordFormState> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not configured." };
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };

  const supabase = await getAdminSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await adminOrigin()}/auth/confirm?next=/reset-password`,
  });
  if (error) {
    logAdminError("auth.resetPasswordForEmail", error.message);
    if (error.code?.startsWith("over_")) return { error: authErrorMessage(error) };
  }

  return { success: "If an admin account exists for this email, a reset link is on its way. Check your inbox." };
}

/** Sets a new password for the user signed in through a reset link. */
export async function resetPassword(_prev: PasswordFormState, formData: FormData): Promise<PasswordFormState> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not configured." };
  const password = String(formData.get("password") ?? "");
  const invalid = validateNewPassword(password, String(formData.get("confirm") ?? ""));
  if (invalid) return { error: invalid };

  const supabase = await getAdminSupabase();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return { error: "Your reset link has expired. Please request a new one." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    logAdminError("auth.resetPassword", error.message);
    return { error: authErrorMessage(error) };
  }

  // Sign out everywhere so the new password is required.
  await supabase.auth.signOut({ scope: "global" });
  redirect("/login?reset=success");
}
