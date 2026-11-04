import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/services";
import { OfferBadge, OfferPrice } from "@/components/OfferTags";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] bg-surface-elevated transition hover:bg-surface sm:rounded-[1.75rem] lg:rounded-[2rem]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <OfferBadge offers={service.offers} className="absolute top-3 left-3" />
      </div>

      <div className="flex flex-1 items-start justify-between gap-2 p-3 sm:gap-3 sm:p-4 lg:p-5">
        <div className="min-w-0">
          <h3 className="font-serif text-base text-cream sm:text-lg lg:text-xl">{service.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted sm:mt-1.5 sm:text-sm">
            {service.description}
          </p>
          <p className="mt-2">
            <OfferPrice price={service.priceFrom} offers={service.offers} className="text-xs text-gold sm:text-sm" />
          </p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-background transition group-hover:bg-gold-soft sm:h-9 sm:w-9">
          <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
