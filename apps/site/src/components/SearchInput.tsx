"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <label className="relative block w-full max-w-md">
      <span className="sr-only">Search</span>
      <Search
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        size={18}
        strokeWidth={1.5}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-surface-elevated py-3 pr-4 pl-11 text-sm text-cream outline-none transition placeholder:text-muted focus:border-gold/60"
      />
    </label>
  );
}
