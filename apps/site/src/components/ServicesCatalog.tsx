"use client";

import { useMemo, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import SearchInput from "@/components/SearchInput";
import { services } from "@/lib/services";

export default function ServicesCatalog() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {filtered.length} service{filtered.length === 1 ? "" : "s"}
          {query.trim() ? ` for “${query.trim()}”` : ""}
        </p>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search services..."
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted">No services match your search.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {filtered.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
