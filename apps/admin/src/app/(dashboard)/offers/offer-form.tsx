"use client";

import { useEffect, useState } from "react";
import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import type { OfferRow } from "@elak/db";
import FormError from "@/components/admin/FormError";
import Select from "@/components/admin/Select";
import PickList, { type PickItem } from "@/components/admin/PickList";
import type { OfferActionState } from "./actions";

const initialState: OfferActionState = {};

export type { PickItem } from "@/components/admin/PickList";

type Props = {
  offer?: OfferRow;
  selectedProductIds?: string[];
  selectedServiceIds?: string[];
  products: PickItem[];
  services: PickItem[];
  action: (prev: OfferActionState, formData: FormData) => Promise<OfferActionState>;
  submitLabel: string;
};

/** ISO → value for <input type="datetime-local"> in the admin's local timezone. */
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** datetime-local value (local time) → ISO (UTC) string, or "" if empty/invalid. */
function toIso(local: string) {
  const ms = Date.parse(local);
  return Number.isNaN(ms) ? "" : new Date(ms).toISOString();
}

export default function OfferForm({
  offer,
  selectedProductIds = [],
  selectedServiceIds = [],
  products,
  services,
  action,
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useFormAction(action, initialState);
  const [discountType, setDiscountType] = useState<OfferRow["discount_type"]>(offer?.discount_type ?? "percent");
  // Store exact instants (ISO, UTC). They are only converted to the admin's local time in the browser,
  // so a server in another timezone (e.g. UTC in production) can never shift the saved start/end.
  const [startsIso, setStartsIso] = useState(offer?.starts_at ?? "");
  const [endsIso, setEndsIso] = useState(offer?.ends_at ?? "");
  const [timeZone, setTimeZone] = useState<string | null>(null);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    // New offer: default to now → 7 days, computed with the browser clock.
    if (!offer) {
      setStartsIso((v) => v || new Date().toISOString());
      setEndsIso((v) => v || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
    }
  }, [offer]);

  const mounted = timeZone !== null;
  const startsLocal = mounted && startsIso ? toLocalInput(startsIso) : "";
  const endsLocal = mounted && endsIso ? toLocalInput(endsIso) : "";

  return (
    <form
      onSubmit={formAction}
      className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />

      <section className="space-y-5">
        <h2 className="font-serif text-xl text-cream">Offer</h2>
        <label className="block">
          <span className="admin-label">Title</span>
          <input
            name="title"
            required
            defaultValue={offer?.title ?? ""}
            placeholder="Eid Special"
            className="admin-input"
          />
        </label>
        <label className="block">
          <span className="admin-label">Description</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={offer?.description ?? ""}
            placeholder="Celebrate with 20% off selected grooming services."
            className="admin-input resize-y"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className="admin-label">Discount type</span>
            <Select
              name="discount_type"
              aria-label="Discount type"
              value={discountType}
              onChange={(v) => setDiscountType(v as OfferRow["discount_type"])}
              options={[
                { value: "percent", label: "Percentage (%)" },
                { value: "fixed", label: "Fixed amount (AED)" },
              ]}
            />
          </div>
          <label className="block">
            <span className="admin-label">{discountType === "percent" ? "Discount (%)" : "Discount (AED)"}</span>
            <input
              name="discount_value"
              type="number"
              required
              min={0.01}
              max={discountType === "percent" ? 100 : undefined}
              step="0.01"
              defaultValue={offer?.discount_value ?? ""}
              placeholder={discountType === "percent" ? "20" : "25"}
              className="admin-input"
            />
          </label>
        </div>
      </section>

      <section className="space-y-5 border-t border-border/60 pt-8">
        <h2 className="font-serif text-xl text-cream">Schedule</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="admin-label">Starts</span>
            <input
              type="datetime-local"
              required
              value={startsLocal}
              disabled={!mounted}
              onChange={(e) => setStartsIso(toIso(e.target.value))}
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="admin-label">Ends</span>
            <input
              type="datetime-local"
              required
              value={endsLocal}
              min={startsLocal}
              disabled={!mounted}
              onChange={(e) => setEndsIso(toIso(e.target.value))}
              className="admin-input"
            />
          </label>
        </div>
        <input type="hidden" name="starts_at" value={startsIso} />
        <input type="hidden" name="ends_at" value={endsIso} />
        <p className="text-xs text-muted">Times are in your local timezone{timeZone ? ` (${timeZone})` : ""}. The offer shows on the site only between these times.</p>

        <label className="flex items-center gap-3 text-sm text-cream">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={offer?.is_active ?? true}
            className="h-4 w-4 accent-[var(--color-gold,#c9a45c)]"
          />
          Enabled (untick to hide this offer without deleting it)
        </label>
      </section>

      <PickList title="Services" name="service_ids" items={services} selected={selectedServiceIds} />
      <PickList title="Products" name="product_ids" items={products} selected={selectedProductIds} />

      <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/offers"
          className="rounded-full border border-border px-6 py-3 text-sm text-muted transition hover:border-gold/40 hover:text-cream"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
