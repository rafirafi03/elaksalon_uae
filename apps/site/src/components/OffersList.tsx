"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import Container from "@/components/Container";
import type { Offer } from "@/lib/offers";
import { countdown, useNow } from "@/lib/use-now";

export default function OffersList({ offers }: { offers: Offer[] }) {
  const now = useNow();
  // Render after mount so the time window uses the visitor's clock (no hydration mismatch).
  if (now === null) return null;

  const live = offers.filter((o) => Date.parse(o.startsAt) <= now && Date.parse(o.endsAt) > now);
  if (live.length === 0) return null;

  return (
    <section id="offers" className="py-8 lg:py-12">
      <Container>
        <div className="mb-8 lg:mb-12">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Limited Time</p>
          <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">Special Offers</h2>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {live.map((offer) => (
            <article
              key={offer.id}
              className="rounded-[1.75rem] border border-gold/30 bg-surface-elevated p-5 sm:p-6 lg:rounded-[2rem] lg:p-8"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-semibold tracking-wide text-background">
                    <Tag size={12} />
                    {offer.discountLabel}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl text-cream lg:text-3xl">{offer.title}</h3>
                  {offer.description ? (
                    <p className="mt-2 max-w-2xl text-sm text-muted lg:text-base">{offer.description}</p>
                  ) : null}
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm text-cream">
                  <Clock size={15} className="text-gold" />
                  <span className="text-muted">Ends in</span>
                  <span className="font-medium tabular-nums">{countdown(Date.parse(offer.endsAt) - now)}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {offer.items.map((item) => (
                  <Link
                    key={`${item.kind}-${item.slug}`}
                    href={`/${item.kind === "product" ? "products" : "services"}/${item.slug}`}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-surface transition hover:bg-background"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] tracking-wider text-gold uppercase backdrop-blur">
                        {item.kind}
                      </span>
                    </div>
                    <div className="p-3 lg:p-4">
                      <p className="truncate font-serif text-base text-cream lg:text-lg">{item.name}</p>
                      <p className="mt-1 flex flex-wrap items-baseline gap-2 text-sm">
                        {item.offerPrice ? (
                          <>
                            <span className="text-gold">{item.offerPrice}</span>
                            <span className="text-xs text-muted line-through">{item.price}</span>
                          </>
                        ) : (
                          <span className="text-gold">{item.price}</span>
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
