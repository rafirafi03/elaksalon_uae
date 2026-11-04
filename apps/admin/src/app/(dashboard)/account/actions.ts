"use server";

import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { logAdminError } from "@/lib/messages";
import { authErrorMessage, validateNewPassword } from "@/lib/password";

export type ChangePasswordState = { error?: string; success?: string };

/** Changes the signed-in admin's password after re-checking the current one. */
export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not configured." };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!current) return { error: "Please enter your current password." };
  const invalid = validateNewPassword(password, String(formData.get("confirm") ?? ""));
  if (invalid) return { error: invalid };
  if (current === password) return { error: "Your new password must be different from the current one." };

  try {
    const supabase = await getAdminSupabase();
    const { data: claims } = await supabase.auth.getClaims();
    const email = claims?.claims?.email as string | undefined;
    if (!email) return { error: "Please sign in again." };

    // Verify the current password before allowing the change.
    const check = await supabase.auth.signInWithPassword({ email, password: current });
    if (check.error) return { error: "Your current password is incorrect." };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      logAdminError("account.changePassword", error.message);
      return { error: authErrorMessage(error) };
    }

    // Keep this session, sign out every other device.
    await supabase.auth.signOut({ scope: "others" });
  } catch (error) {
    logAdminError("account.changePassword", error);
    return { error: "Something went wrong. Please try again." };
  }

  return { success: "Password changed. You've been signed out on other devices." };
}
