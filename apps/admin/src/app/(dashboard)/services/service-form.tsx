"use client";

import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import type { ServiceRow } from "@elak/db";
import ImageUpload from "@/components/admin/ImageUpload";
import FormError from "@/components/admin/FormError";
import Select from "@/components/admin/Select";
import type { ServiceActionState } from "./actions";
import type { CategoryOption } from "./data";

const initialState: ServiceActionState = {};

type Props = {
  service?: ServiceRow;
  categories: CategoryOption[];
  action: (prev: ServiceActionState, formData: FormData) => Promise<ServiceActionState>;
  submitLabel: string;
};

export default function ServiceForm({ service, categories, action, submitLabel }: Props) {
  const [state, formAction, pending] = useFormAction(action, initialState);

  return (
    <form
      onSubmit={formAction}
      className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-5">
          <Field label="Title" name="title" defaultValue={service?.title} required />
          <Field label="Slug" name="slug" defaultValue={service?.slug} hint="Optional — auto from title" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="admin-label">Category</span>
              <Select
                name="category_id"
                aria-label="Category"
                required
                defaultValue={service?.category_id ?? ""}
                placeholder={categories.length ? "Select a category" : "No categories yet"}
                disabled={categories.length === 0}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
              {categories.length === 0 ? (
                <Link href="/categories/new" className="mt-2 inline-block text-xs text-gold hover:text-gold-soft">
                  + Create a category first
                </Link>
              ) : null}
            </div>
            <Field
              label="Duration"
              name="duration"
              defaultValue={service?.duration}
              placeholder="45–60 min"
              required
            />
          </div>
          <Field
            label="Price"
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
