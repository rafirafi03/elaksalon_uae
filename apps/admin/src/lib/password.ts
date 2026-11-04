export const PASSWORD_MIN = 8;

/** Returns an error message, or null when the new password is acceptable. */
export function validateNewPassword(password: string, confirm: string): string | null {
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Password must contain letters and numbers.";
  if (password !== confirm) return "The new passwords do not match.";
  return null;
}

/** Friendly copy for Supabase Auth errors (never leak raw messages). */
export function authErrorMessage(error: { code?: string; message?: string } | null | undefined): string {
  switch (error?.code) {
    case "same_password":
      return "Your new password must be different from the current one.";
    case "weak_password":
      return "That password is too weak. Use a longer password with letters, numbers and symbols.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "reauthentication_needed":
      return "Please sign out and sign in again, then change your password.";
    default:
      return "Something went wrong. Please try again.";
  }
}
