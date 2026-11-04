import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Clock3, Sparkles } from "lucide-react";
import type { ServicePackage } from "@/lib/packages";

const SHOWN = 4;

/** Package card: image, savings badge, included services and price. Whole card links to the detail page. */
export default function PackageCard({ pkg }: { pkg: ServicePackage }) {
  const extra = pkg.services.length - SHOWN;

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex w-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-gold/20 bg-surface-elevated transition hover:border-gold/50 hover:bg-surface sm:rounded-[1.75rem] lg:rounded-[2rem]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-[11px] tracking-wide text-gold uppercase backdrop-blur">
          <Sparkles size={12} />
          {pkg.services.length} services
        </span>
        {pkg.saving ? (
          <span className="absolute top-3 right-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-background shadow-lg">
            Save {pkg.saving}
          </span>
        ) : null}
        <h3 className="absolute inset-x-0 bottom-0 p-4 font-serif text-xl text-cream sm:p-5 lg:text-2xl">{pkg.title}</h3>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {pkg.description ? <p className="line-clamp-2 text-sm text-muted">{pkg.description}</p> : null}

        <ul className={`mb-5 space-y-2 ${pkg.description ? "mt-4" : ""}`}>
          {pkg.services.slice(0, SHOWN).map((s) => (
            <li key={s.slug} className="flex items-center gap-2 text-sm text-cream/85">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Check size={12} />
              </span>
              <span className="truncate">{s.title}</span>
            </li>
          ))}
          {extra > 0 ? <li className="pl-7 text-xs text-muted">+ {extra} more</li> : null}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/60 pt-4">
          <div>
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-serif text-2xl text-gold">{pkg.price}</span>
              {pkg.saving && pkg.separateTotal ? (
                <span className="text-xs text-muted line-through">{pkg.separateTotal}</span>
              ) : null}
            </p>
            {pkg.duration ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted">
                <Clock3 size={12} className="text-gold" />
                {pkg.duration}
              </p>
            ) : null}
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-background transition group-hover:bg-gold-soft">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
