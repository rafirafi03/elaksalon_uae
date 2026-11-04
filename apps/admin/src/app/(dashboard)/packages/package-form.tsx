"use client";

import { useState } from "react";
import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import type { PackageRow } from "@elak/db";
import ImageUpload from "@/components/admin/ImageUpload";
import FormError from "@/components/admin/FormError";
import PickList, { type PickItem } from "@/components/admin/PickList";
import type { PackageActionState } from "./actions";

const initialState: PackageActionState = {};

type Props = {
  pkg?: PackageRow;
  selectedServiceIds?: string[];
  services: PickItem[];
  action: (prev: PackageActionState, formData: FormData) => Promise<PackageActionState>;
  submitLabel: string;
};

function amount(price: string) {
  const match = price.match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : null;
}

export default function PackageForm({ pkg, selectedServiceIds = [], services, action, submitLabel }: Props) {
  const [state, formAction, pending] = useFormAction(action, initialState);
  const [selected, setSelected] = useState(selectedServiceIds);
  const [price, setPrice] = useState(pkg?.price ?? "");

  // Savings preview: sum of the selected services' prices vs the package price.
  const chosen = services.filter((s) => selected.includes(s.id));
  const prices = chosen.map((s) => amount(s.price));
  const separateTotal = prices.every((p) => p !== null) ? prices.reduce<number>((a, b) => a + (b ?? 0), 0) : null;
  const packagePrice = amount(price);
  const saving = separateTotal !== null && packagePrice !== null ? separateTotal - packagePrice : null;

  return (
    <form
      onSubmit={formAction}
      className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <label className="block">
            <span className="admin-label">Package title</span>
            <input
              name="title"
              required
              defaultValue={pkg?.title ?? ""}
              placeholder="Groom Package"
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="admin-label">
              Slug <span className="ml-2 normal-case tracking-normal opacity-70">optional, from title if empty</span>
            </span>
            <input name="slug" defaultValue={pkg?.slug ?? ""} placeholder="groom-package" className="admin-input" />
          </label>
          <label className="block">
            <span className="admin-label">Description</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={pkg?.description ?? ""}
              placeholder="Everything you need before the big day."
              className="admin-input resize-y"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="admin-label">Package price</span>
              <input
                name="price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="AED 199"
                className="admin-input"
              />
            </label>
            <label className="block">
              <span className="admin-label">
                Duration <span className="ml-2 normal-case tracking-normal opacity-70">optional</span>
              </span>
              <input name="duration" defaultValue={pkg?.duration ?? ""} placeholder="2 hrs" className="admin-input" />
            </label>
          </div>
          <label className="block">
            <span className="admin-label">
              Extras <span className="ml-2 normal-case tracking-normal opacity-70">optional, one per line</span>
            </span>
            <textarea
              name="details"
              rows={3}
              defaultValue={(pkg?.details ?? []).join("\n")}
              placeholder={"Complimentary drink\nPremium products"}
              className="admin-input resize-y"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-cream">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={pkg?.is_published ?? true}
              className="h-4 w-4 accent-[var(--color-gold,#c9a45c)]"
            />
            Show on website
          </label>
        </div>

        <div>
          <ImageUpload name="image_url" folder="packages" defaultValue={pkg?.image_url ?? ""} />
          <p className="mt-2 text-xs text-muted">Optional. If empty, the first service’s image is used.</p>
        </div>
      </div>

      <PickList
        title="Services in this package"
        name="service_ids"
        items={services}
        selected={selectedServiceIds}
        onChange={setSelected}
      />

      {chosen.length > 0 ? (
        <div className="rounded-2xl border border-border/70 bg-surface p-4 text-sm">
          <p className="text-cream">
            {chosen.length} service{chosen.length === 1 ? "" : "s"} selected
            {chosen.length < 2 ? <span className="text-danger"> · select at least 2</span> : null}
          </p>
          {separateTotal !== null ? (
            <p className="mt-1 text-muted">
              Booked separately: <span className="text-cream">AED {separateTotal}</span>
              {saving !== null && saving > 0 ? (
                <>
                  {" "}
                  · Customer saves <span className="text-gold">AED {saving}</span> (shown on the website)
                </>
              ) : null}
              {saving !== null && saving < 0 ? (
                <span className="text-danger"> · package price is higher than booking separately</span>
              ) : null}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/packages"
          className="rounded-full border border-border px-6 py-3 text-sm text-muted transition hover:border-gold/40 hover:text-cream"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
