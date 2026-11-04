"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, X } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import SearchInput from "@/components/SearchInput";
import Select from "@/components/Select";
import type { Service } from "@/lib/services";
import type { ServiceCategory } from "@/lib/categories";
import { cn } from "@/lib/cn";

const SORTS = {
  default: "Recommended",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "name-asc": "Name: A–Z",
  "name-desc": "Name: Z–A",
} as const;
type SortKey = keyof typeof SORTS;

function priceOf(service: Service) {
  const match = service.priceFrom.match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : Number.POSITIVE_INFINITY; // no price → last
}

export default function ServicesCatalog({
  services,
  categories,
}: {
  services: Service[];
  categories: ServiceCategory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState("");

  const category = params.get("category") ?? "";
  const sortParam = params.get("sort") ?? "default";
  const sort: SortKey = sortParam in SORTS ? (sortParam as SortKey) : "default";
  const activeCategory = categories.find((c) => c.slug === category);

  /** Updates ?category / ?sort without scrolling or adding history entries. */
  function setParam(key: "category" | "sort", value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "default") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = services.filter(
      (s) =>
        (!category || s.categorySlug === category) &&
        (!q ||
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)),
    );
    const byName = (a: Service, b: Service) => a.title.localeCompare(b.title);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => priceOf(a) - priceOf(b) || byName(a, b));
      case "price-desc":
        return [...list].sort((a, b) => {
          const pa = priceOf(a);
          const pb = priceOf(b);
          // Keep services without a price at the end in both directions.
          if (pa === Infinity || pb === Infinity) return pa === pb ? byName(a, b) : pa === Infinity ? 1 : -1;
          return pb - pa || byName(a, b);
        });
      case "name-asc":
        return [...list].sort(byName);
      case "name-desc":
        return [...list].sort((a, b) => byName(b, a));
      default:
        return list;
    }
  }, [services, category, sort, query]);

  const hasFilters = Boolean(category || sort !== "default" || query.trim());

  const chip = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition",
      active ? "border-gold bg-gold text-background" : "border-border text-cream/80 hover:border-gold/50 hover:text-cream",
    );

  return (
    <div>
      {categories.length > 0 ? (
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter by category"
        >
          <button type="button" onClick={() => setParam("category", "")} className={chip(!category)} aria-pressed={!category}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setParam("category", c.slug === category ? "" : c.slug)}
              className={chip(c.slug === category)}
              aria-pressed={c.slug === category}
            >
              {c.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search services..." />
        <Select
          aria-label="Sort services"
          value={sort}
          onChange={(v) => setParam("sort", v)}
          icon={<ArrowDownUp size={15} />}
          options={(Object.keys(SORTS) as SortKey[]).map((key) => ({ value: key, label: SORTS[key] }))}
          className="w-full shrink-0 sm:w-60"
          buttonClassName="rounded-full border border-border bg-surface-elevated px-4 py-3 text-sm text-cream outline-none transition hover:border-gold/50 focus-visible:border-gold"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm text-muted">
          {filtered.length} service{filtered.length === 1 ? "" : "s"}
          {activeCategory ? ` in ${activeCategory.name}` : ""}
          {query.trim() ? ` for “${query.trim()}”` : ""}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-cream transition hover:border-gold hover:text-gold"
          >
            <X size={12} />
            Clear filters
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted">No services match your filters.</p>
          {hasFilters ? (
            <button type="button" onClick={clearAll} className="mt-4 text-sm text-gold hover:text-gold-soft">
              View all services
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {filtered.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
