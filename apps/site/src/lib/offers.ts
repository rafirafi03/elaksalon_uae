import { cacheLife, cacheTag } from "next/cache";
import type { OfferRow, ProductRow, ServiceRow } from "@elak/db";
import { getPublicSupabase } from "@/lib/supabase";

export type OfferItem = {
  kind: "product" | "service";
  slug: string;
  name: string;
  image: string;
  price: string;
  offerPrice: string | null;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  startsAt: string;
  endsAt: string;
  items: OfferItem[];
};

type OfferQueryRow = OfferRow & {
  offer_products: { products: ProductRow | null }[];
  offer_services: { services: ServiceRow | null }[];
};

/** Applies the discount to a price string like "AED 85". Returns null when no number is found. */
export function applyDiscount(price: string, type: OfferRow["discount_type"], value: number): string | null {
  const match = price.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const amount = Number(match[1].replace(",", "."));
  const next = Math.max(0, type === "percent" ? amount * (1 - value / 100) : amount - value);
  const formatted = Number.isInteger(next) ? String(next) : next.toFixed(2);
  return price.replace(match[1], formatted);
}

export function discountLabel(type: OfferRow["discount_type"], value: number) {
  return type === "percent" ? `${Number(value)}% OFF` : `AED ${Number(value)} OFF`;
}

/**
 * Offers that have not ended yet (live + upcoming) with their products/services.
 * The exact start/end check happens on the client so offers switch on time despite caching.
 */
export async function getOffers(): Promise<Offer[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("offers"); // expired on demand when offers change in the admin

  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("offers")
      .select("*, offer_products(products(*)), offer_services(services(*))")
      .eq("is_active", true)
      .gt("ends_at", new Date().toISOString())
      .order("ends_at", { ascending: true });

    if (error || !data) {
      if (error) console.error("[site] offers load failed", error);
      return [];
    }

    return (data as unknown as OfferQueryRow[])
      .map((row) => {
        const value = Number(row.discount_value);
        const items: OfferItem[] = [
          ...(row.offer_services ?? [])
            .map((link) => link.services)
            .filter((s): s is ServiceRow => Boolean(s))
            .map((s) => ({
              kind: "service" as const,
              slug: s.slug,
              name: s.title,
              image: s.image_url,
              price: s.price_from,
              offerPrice: applyDiscount(s.price_from, row.discount_type, value),
            })),
          ...(row.offer_products ?? [])
            .map((link) => link.products)
            .filter((p): p is ProductRow => Boolean(p))
            .map((p) => ({
              kind: "product" as const,
              slug: p.slug,
              name: p.name,
              image: p.image_url,
              price: p.price,
              offerPrice: applyDiscount(p.price, row.discount_type, value),
            })),
        ];
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          discountLabel: discountLabel(row.discount_type, value),
          startsAt: row.starts_at,
          endsAt: row.ends_at,
          items,
        };
      })
      .filter((offer) => offer.items.length > 0);
  } catch (error) {
    console.error("[site] offers load failed", error);
    return [];
  }
}

/** An offer as applied to one product/service. */
export type ItemOffer = {
  id: string;
  title: string;
  label: string;
  offerPrice: string | null;
  startsAt: string;
  endsAt: string;
};

/** Offers per item, keyed "product:<slug>" / "service:<slug>". */
export async function getOfferIndex(): Promise<Record<string, ItemOffer[]>> {
  const index: Record<string, ItemOffer[]> = {};
  for (const offer of await getOffers()) {
    for (const item of offer.items) {
      (index[`${item.kind}:${item.slug}`] ??= []).push({
        id: offer.id,
        title: offer.title,
        label: offer.discountLabel,
        offerPrice: item.offerPrice,
        startsAt: offer.startsAt,
        endsAt: offer.endsAt,
      });
    }
  }
  return index;
}
