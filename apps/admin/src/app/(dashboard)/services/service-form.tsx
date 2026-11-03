"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ServiceRow } from "@elak/db";
import ImageUpload from "@/components/admin/ImageUpload";
import FormError from "@/components/admin/FormError";
import type { ServiceActionState } from "./actions";

const initialState: ServiceActionState = {};

type Props = {
  service?: ServiceRow;
  action: (prev: ServiceActionState, formData: FormData) => Promise<ServiceActionState>;
  submitLabel: string;
};

export default function ServiceForm({ service, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-5">
          <Field label="Title" name="title" defaultValue={service?.title} required />
          <Field label="Slug" name="slug" defaultValue={service?.slug} hint="Optional — auto from title" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" name="category" defaultValue={service?.category} placeholder="Hair" required />
            <Field
              label="Duration"
              name="duration"
              defaultValue={service?.duration}
              placeholder="45–60 min"
              required
            />
          </div>
          <Field
            label="Starting price"
            name="price_from"
            defaultValue={service?.price_from}
            placeholder="AED 80"
            required
          />
          <label className="block">
            <span className="admin-label">Description</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={service?.description ?? ""}
              className="admin-input resize-y"
            />
          </label>
          <label className="block">
            <span className="admin-label">Includes (one per line)</span>
            <textarea
              name="details"
              rows={5}
              defaultValue={(service?.details ?? []).join("\n")}
              className="admin-input resize-y"
              placeholder={"Consultation\nPrecision cut"}
            />
          </label>
        </div>

        <div>
          <ImageUpload
            name="image_url"
            folder="services"
            defaultValue={service?.image_url}
            required
          />
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
          href="/services"
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
