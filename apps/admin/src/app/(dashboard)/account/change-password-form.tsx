"use client";

import { useEffect, useRef } from "react";
import { useFormAction } from "@/lib/use-form-action";
import FormError from "@/components/admin/FormError";
import PasswordInput from "@/components/admin/PasswordInput";
import { PASSWORD_MIN } from "@/lib/password";
import { changePassword, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = {};

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useFormAction(changePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      onSubmit={formAction}
      className="max-w-xl space-y-5 rounded-[2rem] bg-surface-elevated p-6 sm:p-8"
    >
      <h2 className="font-serif text-xl text-cream">Change password</h2>
      <FormError message={state.error} />
      {state.success ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-cream">{state.success}</p>
      ) : null}
      <PasswordInput label="Current password" name="current" autoComplete="current-password" />
      <PasswordInput
        label="New password"
        name="password"
        autoComplete="new-password"
        hint={`min ${PASSWORD_MIN} chars, letters + numbers`}
      />
      <PasswordInput label="Confirm new password" name="confirm" autoComplete="new-password" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
