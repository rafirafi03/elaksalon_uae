"use client";

import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormError from "@/components/admin/FormError";
import { requestPasswordReset, type PasswordFormState } from "../login/actions";

const initialState: PasswordFormState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useFormAction(requestPasswordReset, initialState);

  return (
    <div className="space-y-5">
      {state.success ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-cream">{state.success}</p>
      ) : (
        <form onSubmit={formAction} className="space-y-5">
          <FormError message={state.error} />
          <label className="block">
            <span className="admin-label">Email</span>
            <input type="email" name="email" autoComplete="email" required className="admin-input" />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold">
        <ArrowLeft size={14} />
        Back to sign in
      </Link>
    </div>
  );
}
