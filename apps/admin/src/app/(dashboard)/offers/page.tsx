import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import type { OfferRow } from "@elak/db";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import { cn } from "@/lib/cn";
import DeleteOfferButton from "./delete-button";
import LocalTime from "./local-time";

export const instant = false;

type OfferListRow = OfferRow & {
  offer_products: { count: number }[];
  offer_services: { count: number }[];
};

function status(offer: OfferRow, now: number) {
  if (!offer.is_active) return { label: "Disabled", className: "bg-surface text-muted" };
  if (Date.parse(offer.ends_at) <= now) return { label: "Expired", className: "bg-surface text-muted" };
  if (Date.parse(offer.starts_at) > now) return { label: "Scheduled", className: "bg-cream/10 text-cream" };
  return { label: "Live", className: "bg-gold text-background" };
}

export default async function AdminOffersPage() {
  await connection();
  // Request-time server component (after connection()), so reading the clock here is intended.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  let offers: OfferListRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = await getAdminSupabase();
      const { data, error } = await supabase
        .from("offers")
        .select("*, offer_products(count), offer_services(count)")
        .order("starts_at", { ascending: false });

      if (error) {
        logAdminError("offers.list", error);
        failed = true;
      } else {
        offers = (data ?? []) as unknown as OfferListRow[];
      }
    } catch (error) {
      logAdminError("offers.list", error);
      failed = true;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title="Offers"
        description="Time-limited discounts on products and services. Live offers show under the hero on the site."
        action={
          <Link
            href="/offers/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background transition hover:bg-gold-soft"
          >
            <Plus size={16} />
            Add offer
          </Link>
        }
      />

      {failed ? <ErrorState description={MSG.loadFailed} retryHref="/offers" /> : null}

      {!failed && offers.length === 0 ? (
        <EmptyState
          title="No offers yet"
          description="Create an offer and attach it to products or services."
          actionHref="/offers/new"
          actionLabel="Add offer"
        />
      ) : null}

      {!failed && offers.length > 0 ? (
        <div className="overflow-hidden rounded-[1.75rem] bg-surface-elevated">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/70 text-[10px] tracking-[0.2em] text-muted uppercase">
                  <th className="px-5 py-4 font-medium">Offer</th>
                  <th className="px-4 py-4 font-medium">Discount</th>
                  <th className="px-4 py-4 font-medium">Schedule</th>
                  <th className="px-4 py-4 font-medium">Applies to</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => {
                  const s = status(offer, now);
                  const productCount = offer.offer_products?.[0]?.count ?? 0;
                  const serviceCount = offer.offer_services?.[0]?.count ?? 0;
                  return (
                    <tr key={offer.id} className="border-t border-border/50 transition hover:bg-surface">
                      <td className="px-5 py-4">
                        <div className="font-serif text-base text-cream">{offer.title}</div>
                        <div className="line-clamp-1 text-xs text-muted">{offer.description}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gold">
                        {offer.discount_type === "percent"
                          ? `${Number(offer.discount_value)}%`
                          : `AED ${Number(offer.discount_value)}`}
                      </td>
                      <td className="px-4 py-4 text-xs whitespace-nowrap text-muted">
                        <LocalTime iso={offer.starts_at} />
                        <br />→ <LocalTime iso={offer.ends_at} />
                      </td>
                      <td className="px-4 py-4 text-xs whitespace-nowrap text-muted">
                        {serviceCount} service{serviceCount === 1 ? "" : "s"}
                        <br />
                        {productCount} product{productCount === 1 ? "" : "s"}
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("rounded-full px-3 py-1 text-xs whitespace-nowrap", s.className)}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/offers/${offer.id}/edit`}
                            className="text-sm text-gold transition hover:text-gold-soft"
                          >
                            Edit
                          </Link>
                          <DeleteOfferButton id={offer.id} title={offer.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
