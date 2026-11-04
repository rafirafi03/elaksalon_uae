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
import SortableTable from "@/components/admin/SortableTable";
import { bulkDeleteProducts, reorderProducts } from "./actions";

export const instant = false;

export default async function AdminProductsPage() {
  await connection();

  let products: ProductRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = await getAdminSupabase();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
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
        <SortableTable
          itemType="product"
          itemTypePlural="products"
          onReorder={reorderProducts}
          onBulkDelete={bulkDeleteProducts}
          columns={[
            { label: "Product" },
            { label: "Category" },
            { label: "Price" },
            { label: "Slug", className: "hidden md:table-cell" },
            { label: "Actions", className: "pr-5 text-right" },
          ]}
          rows={products.map((product) => ({
            id: product.id,
            label: product.name,
            cells: [
              <div key="p" className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image_url} alt="" className="h-12 w-12 rounded-2xl bg-surface object-cover" />
                <div>
                  <div className="font-serif text-base text-cream">{product.name}</div>
                  <div className="text-xs tracking-wide text-muted uppercase">{product.brand}</div>
                </div>
              </div>,
              <span key="c" className="text-muted">{product.category}</span>,
              <span key="pr" className="text-gold">{product.price}</span>,
              <span key="s" className="font-mono text-xs text-muted">{product.slug}</span>,
              <div key="a" className="flex items-center justify-end gap-4">
                <Link href={`/products/${product.id}/edit`} className="text-sm text-gold transition hover:text-gold-soft">
                  Edit
                </Link>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>,
            ],
          }))}
        />
      ) : null}
    </>
  );
}
