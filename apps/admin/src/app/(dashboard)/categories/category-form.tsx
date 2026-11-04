"use client";

import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import type { ServiceCategoryRow } from "@elak/db";
import ImageUpload from "@/components/admin/ImageUpload";
import FormError from "@/components/admin/FormError";
import PickList, { type PickItem } from "@/components/admin/PickList";
import type { CategoryActionState } from "./actions";

const initialState: CategoryActionState = {};

type Props = {
  category?: ServiceCategoryRow;
  services: PickItem[];
  selectedServiceIds?: string[];
  action: (prev: CategoryActionState, formData: FormData) => Promise<CategoryActionState>;
  submitLabel: string;
};

export default function CategoryForm({ category, services, selectedServiceIds = [], action, submitLabel }: Props) {
  const [state, formAction, pending] = useFormAction(action, initialState);

  return (
    <form
      onSubmit={formAction}
      className="max-w-3xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />

      <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
        <label className="block">
          <span className="admin-label">Category name</span>
          <input
            name="name"
            required
            maxLength={80}
            defaultValue={category?.name ?? ""}
            placeholder="Massage"
            className="admin-input"
          />
          <span className="mt-2 block text-xs text-muted">Shown in the home page carousel and service filters.</span>
        </label>

        <ImageUpload name="image_url" folder="categories" defaultValue={category?.image_url ?? ""} required />
      </div>

      <div>
        <PickList title="Services in this category" name="service_ids" items={services} selected={selectedServiceIds} />
        <p className="mt-3 text-xs text-muted">
          A service belongs to one category: ticking a service that is “in” another category moves it here. Unticked
          services that were in this category become uncategorised.
        </p>
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
          href="/categories"
          className="rounded-full border border-border px-6 py-3 text-sm text-muted transition hover:border-gold/40 hover:text-cream"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
