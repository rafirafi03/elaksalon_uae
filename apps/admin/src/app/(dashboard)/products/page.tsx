import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import type { ProductRow } from "@elak/db";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import DeleteProductButton from "./delete-button";

export const instant = false;

export default async function AdminProductsPage() {
  await connection();

  let products: ProductRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = getAdminSupabase();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        logAdminError("products.list", error);
        failed = true;
      } else {
        products = data ?? [];
      }
    } catch (error) {
      logAdminError("products.list", error);
      failed = true;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Create and manage retail products shown on the public site."
        action={
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background transition hover:bg-gold-soft"
          >
            <Plus size={16} />
            Add product
          </Link>
        }
      />

      {failed ? (
        <ErrorState description={MSG.loadFailed} retryHref="/products" />
      ) : null}

      {!failed && products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to show it on the public catalog."
          actionHref="/products/new"
          actionLabel="Add product"
        />
      ) : null}

      {!failed && products.length > 0 ? (
        <div className="overflow-hidden rounded-[1.75rem] bg-surface-elevated">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/70 text-[10px] tracking-[0.2em] text-muted uppercase">
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Price</th>
                  <th className="hidden px-4 py-4 font-medium md:table-cell">Slug</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-border/50 transition hover:bg-surface">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image_url}
                          alt=""
                          className="h-12 w-12 rounded-2xl bg-surface object-cover"
                        />
                        <div>
                          <div className="font-serif text-base text-cream">{product.name}</div>
                          <div className="text-xs tracking-wide text-muted uppercase">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted">{product.category}</td>
                    <td className="px-4 py-4 text-gold">{product.price}</td>
                    <td className="hidden px-4 py-4 font-mono text-xs text-muted md:table-cell">
                      {product.slug}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="text-sm text-gold transition hover:text-gold-soft"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
