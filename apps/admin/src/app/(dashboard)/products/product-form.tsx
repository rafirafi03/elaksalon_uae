"use client";

import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import type { ProductRow } from "@elak/db";
import ImageUpload from "@/components/admin/ImageUpload";
import FormError from "@/components/admin/FormError";
import type { ProductActionState } from "./actions";

const initialState: ProductActionState = {};

type Props = {
  product?: ProductRow;
  action: (prev: ProductActionState, formData: FormData) => Promise<ProductActionState>;
  submitLabel: string;
};

export default function ProductForm({ product, action, submitLabel }: Props) {
  const [state, formAction, pending] = useFormAction(action, initialState);

  return (
    <form
      onSubmit={formAction}
      className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-5">
          <Field label="Name" name="name" defaultValue={product?.name} required />
          <Field label="Slug" name="slug" defaultValue={product?.slug} hint="Optional — auto from name" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Brand" name="brand" defaultValue={product?.brand} required />
            <Field label="Price" name="price" defaultValue={product?.price} placeholder="AED 85" required />
          </div>
          <Field label="Category" name="category" defaultValue={product?.category} placeholder="Hair" required />
          <label className="block">
            <span className="admin-label">Description</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              className="admin-input resize-y"
            />
          </label>
          <label className="block">
            <span className="admin-label">Details (one per line)</span>
            <textarea
              name="details"
              rows={5}
              defaultValue={(product?.details ?? []).join("\n")}
              className="admin-input resize-y"
              placeholder={"Strong hold\nMatte finish"}
            />
          </label>
        </div>

        <div>
          <ImageUpload
            name="image_url"
            folder="products"
            defaultValue={product?.image_url}
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
          href="/products"
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
