"use client";

import { useMemo, useState } from "react";
import SpecialistCard from "@/components/SpecialistCard";
import SearchInput from "@/components/SearchInput";
import type { Specialist } from "@/lib/specialists";

export default function SpecialistsCatalog({ specialists }: { specialists: Specialist[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return specialists;
    return specialists.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.experience.toLowerCase().includes(q),
    );
  }, [query, specialists]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {filtered.length} specialist{filtered.length === 1 ? "" : "s"}
          {query.trim() ? ` for “${query.trim()}”` : ""}
        </p>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name, role, specialty..."
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted">No specialists match your search.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {filtered.map((person) => (
            <SpecialistCard key={person.slug} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
