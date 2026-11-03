"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SearchInput from "@/components/SearchInput";
import { products } from "@/lib/products";

export default function ProductsCatalog() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.price.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
          {query.trim() ? ` for “${query.trim()}”` : ""}
        </p>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search products, brands..."
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted">No products match your search.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
