"use client";

import { Clock, Tag } from "lucide-react";
import type { ItemOffer } from "@/lib/offers";
import { countdown, useNow } from "@/lib/use-now";

function amount(price: string | null) {
  const match = price?.match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : Number.POSITIVE_INFINITY;
}

/** Best (lowest price) offer that is live right now, or null. */
export function useLiveOffer(offers: ItemOffer[] | undefined) {
  const now = useNow();
  if (now === null || !offers?.length) return { offer: null, now };
  const live = offers.filter((o) => Date.parse(o.startsAt) <= now && Date.parse(o.endsAt) > now);
  const offer = live.sort((a, b) => amount(a.offerPrice) - amount(b.offerPrice))[0] ?? null;
  return { offer, now };
}

/** "20% OFF" badge for card images. Renders nothing when no offer is live. */
export function OfferBadge({ offers, className = "" }: { offers?: ItemOffer[]; className?: string }) {
  const { offer } = useLiveOffer(offers);
  if (!offer) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold tracking-wide text-background shadow-lg sm:text-xs ${className}`}
    >
      <Tag size={11} />
      {offer.label}
    </span>
  );
}

/** Price that switches to the offer price (original struck through) while an offer is live. */
export function OfferPrice({
  price,
  offers,
  prefix = "",
  className = "text-sm text-gold lg:text-base",
}: {
  price: string;
  offers?: ItemOffer[];
  prefix?: string;
  className?: string;
}) {
  const { offer } = useLiveOffer(offers);
  if (!offer?.offerPrice) {
    return <span className={className}>{prefix}{price}</span>;
  }
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={className}>{prefix}{offer.offerPrice}</span>
      <span className="text-xs text-muted line-through">{price}</span>
    </span>
  );
}

/** Offer banner for detail pages: title, discount and live countdown. */
export function OfferBanner({ offers }: { offers?: ItemOffer[] }) {
  const { offer, now } = useLiveOffer(offers);
  if (!offer || now === null) return null;
  return (
    <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-gold/40 bg-gold/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-background">
          <Tag size={12} />
          {offer.label}
        </span>
        <span className="font-serif text-lg text-cream">{offer.title}</span>
      </div>
      <span className="inline-flex items-center gap-2 text-sm text-cream">
        <Clock size={15} className="text-gold" />
        <span className="text-muted">Ends in</span>
        <span className="font-medium tabular-nums">{countdown(Date.parse(offer.endsAt) - now)}</span>
      </span>
    </div>
  );
}
