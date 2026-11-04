"use client";

import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import type { SpecialistRow } from "@elak/db";
import ImageUpload from "@/components/admin/ImageUpload";
import FormError from "@/components/admin/FormError";
import type { SpecialistActionState } from "./actions";

const initialState: SpecialistActionState = {};

type Props = {
  specialist?: SpecialistRow;
  action: (prev: SpecialistActionState, formData: FormData) => Promise<SpecialistActionState>;
  submitLabel: string;
};

export default function SpecialistForm({ specialist, action, submitLabel }: Props) {
  const [state, formAction, pending] = useFormAction(action, initialState);

  return (
    <form
      onSubmit={formAction}
      className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-5">
          <Field label="Name" name="name" defaultValue={specialist?.name} required />
          <Field label="Slug" name="slug" defaultValue={specialist?.slug} hint="Optional — auto from name" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Role" name="role" defaultValue={specialist?.role} placeholder="Master Barber" required />
            <Field
              label="Experience"
              name="experience"
              defaultValue={specialist?.experience}
              placeholder="12 yrs"
              required
            />
          </div>
          <Field
            label="Specialty"
            name="specialty"
            defaultValue={specialist?.specialty}
            placeholder="Fades & classic cuts"
            required
          />
          <label className="block">
            <span className="admin-label">Bio</span>
            <textarea
              name="bio"
              rows={4}
              defaultValue={specialist?.bio ?? ""}
              className="admin-input resize-y"
            />
          </label>
          <label className="block">
            <span className="admin-label">Skills (one per line)</span>
            <textarea
              name="skills"
              rows={5}
              defaultValue={(specialist?.skills ?? []).join("\n")}
              className="admin-input resize-y"
              placeholder={"Skin fades\nClassic cuts"}
            />
          </label>
        </div>

        <div>
          <ImageUpload
            name="image_url"
            folder="specialists"
            defaultValue={specialist?.image_url}
          />
          <p className="mt-2 text-xs text-muted">Optional. A monogram avatar is shown on the site when empty.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/specialists"
          className="rounded-full border border-border px-6 py-3 text-sm text-muted transition hover:border-gold/40 hover:text-cream"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="admin-label">
        {label}
        {hint ? <span className="ml-2 normal-case tracking-normal opacity-70">{hint}</span> : null}
      </span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="admin-input"
      />
    </label>
  );
}
