"use client";

import { useState } from "react";

export type PickItem = {
  id: string;
  name: string;
  image_url: string;
  price: string;
  /** Optional muted note, e.g. the current category. */
  note?: string;
};

/** Searchable checkbox list (with thumbnails). Submits checked ids as repeated `name` fields. */
export default function PickList({
  title,
  name,
  items,
  selected,
  onChange,
}: {
  title: string;
  name: string;
  items: PickItem[];
  selected: string[];
  onChange?: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(() => new Set(selected));
  const q = query.trim().toLowerCase();

  return (
    <section className="space-y-4 border-t border-border/60 pt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-xl text-cream">
          {title} <span className="text-sm text-muted">({checked.size} selected)</span>
        </h2>
        {items.length > 6 ? (
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="admin-input sm:max-w-xs"
          />
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">No {title.toLowerCase()} yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const isChecked = checked.has(item.id);
            // Filtered-out items stay in the DOM (hidden) so their selection is still submitted.
            const hidden = q && !item.name.toLowerCase().includes(q);
            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition ${
                  isChecked ? "border-gold bg-gold/10" : "border-border hover:border-gold/40"
                } ${hidden ? "hidden" : ""}`}
              >
                <input
                  type="checkbox"
                  name={name}
                  value={item.id}
                  checked={isChecked}
                  onChange={(e) =>
                    setChecked((prev) => {
                      const next = new Set(prev);
                      if (e.target.checked) next.add(item.id);
                      else next.delete(item.id);
                      onChange?.([...next]);
                      return next;
                    })
                  }
                  className="h-4 w-4 shrink-0 accent-[var(--color-gold,#c9a45c)]"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt="" className="h-10 w-10 shrink-0 rounded-xl bg-surface object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-cream">{item.name}</span>
                  <span className="block text-xs">
                    <span className="text-gold">{item.price}</span>
                    {item.note ? <span className="text-muted"> · {item.note}</span> : null}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}
