"use client";

import { useFormAction } from "@/lib/use-form-action";
import FormError from "@/components/admin/FormError";
import PasswordInput from "@/components/admin/PasswordInput";
import { PASSWORD_MIN } from "@/lib/password";
import { resetPassword, type PasswordFormState } from "../login/actions";

const initialState: PasswordFormState = {};

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useFormAction(resetPassword, initialState);

  return (
    <form onSubmit={formAction} className="space-y-5">
      <FormError message={state.error} />
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
        className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
