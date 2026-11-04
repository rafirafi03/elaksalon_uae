import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import type { ServiceCategoryRow } from "@elak/db";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ErrorState from "@/components/admin/ErrorState";
import SortableTable from "@/components/admin/SortableTable";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import DeleteCategoryButton from "./delete-button";
import { bulkDeleteCategories, reorderCategories } from "./actions";

export const instant = false;

type CategoryListRow = ServiceCategoryRow & { services: { count: number }[] };

export default async function AdminCategoriesPage() {
  await connection();

  let categories: CategoryListRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = await getAdminSupabase();
      const { data, error } = await supabase
        .from("service_categories")
        .select("*, services(count)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) {
        logAdminError("categories.list", error);
        failed = true;
      } else {
        categories = (data ?? []) as unknown as CategoryListRow[];
      }
    } catch (error) {
      logAdminError("categories.list", error);
      failed = true;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Service categories"
        description="Group services (e.g. Massage, Hair, Beard). Shown as a carousel on the home page."
        action={
          <Link
            href="/categories/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background transition hover:bg-gold-soft"
          >
            <Plus size={16} />
            Add category
          </Link>
        }
      />

      {failed ? <ErrorState description={MSG.loadFailed} retryHref="/categories" /> : null}

      {!failed && categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Add a category, then choose it when adding or editing a service."
          actionHref="/categories/new"
          actionLabel="Add category"
        />
      ) : null}

      {!failed && categories.length > 0 ? (
        <SortableTable
          itemType="category"
          itemTypePlural="categories"
          onReorder={reorderCategories}
          onBulkDelete={bulkDeleteCategories}
          columns={[
            { label: "Category" },
            { label: "Services" },
            { label: "Slug", className: "hidden md:table-cell" },
            { label: "Actions", className: "pr-5 text-right" },
          ]}
          rows={categories.map((category) => {
            const count = category.services?.[0]?.count ?? 0;
            return {
              id: category.id,
              label: category.name,
              cells: [
                <div key="c" className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={category.image_url} alt="" className="h-12 w-12 rounded-2xl bg-surface object-cover" />
                  <div className="font-serif text-base text-cream">{category.name}</div>
                </div>,
                <span key="n" className="text-muted">
                  {count} service{count === 1 ? "" : "s"}
                </span>,
                <span key="s" className="font-mono text-xs text-muted">
                  {category.slug}
                </span>,
                <div key="a" className="flex items-center justify-end gap-4">
                  <Link
                    href={`/categories/${category.id}/edit`}
                    className="text-sm text-gold transition hover:text-gold-soft"
                  >
                    Edit
                  </Link>
                  <DeleteCategoryButton id={category.id} name={category.name} serviceCount={count} />
                </div>,
              ],
            };
          })}
        />
      ) : null}
    </>
  );
}
