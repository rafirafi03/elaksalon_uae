"use client";

import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FormError from "@/components/admin/FormError";
import PasswordInput from "@/components/admin/PasswordInput";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useFormAction(signIn, initialState);
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const notice =
    params.get("reset") === "success"
      ? "Your password was changed. Please sign in with your new password."
      : params.get("error") === "link"
        ? "That reset link is invalid or has expired. Please request a new one."
        : null;

  return (
    <form onSubmit={formAction} className="space-y-5">
      {notice && !state.error ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-cream">{notice}</p>
      ) : null}
      <FormError message={state.error} />
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="admin-label">Email</span>
        <input type="email" name="email" autoComplete="email" required className="admin-input" />
      </label>
      <div>
        <PasswordInput label="Password" name="password" autoComplete="current-password" />
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-xs text-gold transition hover:text-gold-soft">
            Forgot password?
          </Link>
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
