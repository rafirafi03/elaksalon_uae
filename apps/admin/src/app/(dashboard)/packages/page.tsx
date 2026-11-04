import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import type { PackageRow } from "@elak/db";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ErrorState from "@/components/admin/ErrorState";
import SortableTable from "@/components/admin/SortableTable";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import DeletePackageButton from "./delete-button";
import { bulkDeletePackages, reorderPackages } from "./actions";

export const instant = false;

type PackageListRow = PackageRow & {
  package_services: { position: number; services: { title: string; image_url: string } | null }[];
};

export default async function AdminPackagesPage() {
  await connection();

  let packages: PackageListRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = await getAdminSupabase();
      const { data, error } = await supabase
        .from("packages")
        .select("*, package_services(position, services(title, image_url))")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        logAdminError("packages.list", error);
        failed = true;
      } else {
        packages = (data ?? []) as unknown as PackageListRow[];
      }
    } catch (error) {
      logAdminError("packages.list", error);
      failed = true;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Packages"
        description="Bundles of several services sold at one price. Shown in their own section on the website."
        action={
          <Link
            href="/packages/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background transition hover:bg-gold-soft"
          >
            <Plus size={16} />
            Add package
          </Link>
        }
      />

      {failed ? <ErrorState description={MSG.loadFailed} retryHref="/packages" /> : null}

      {!failed && packages.length === 0 ? (
        <EmptyState
          title="No packages yet"
          description="Combine two or more services into a package with its own price."
          actionHref="/packages/new"
          actionLabel="Add package"
        />
      ) : null}

      {!failed && packages.length > 0 ? (
        <SortableTable
          itemType="package"
          itemTypePlural="packages"
          onReorder={reorderPackages}
          onBulkDelete={bulkDeletePackages}
          columns={[
            { label: "Package" },
            { label: "Services", className: "max-w-xs" },
            { label: "Price" },
            { label: "Status" },
            { label: "Actions", className: "pr-5 text-right" },
          ]}
          rows={packages.map((pkg) => {
            const services = [...(pkg.package_services ?? [])]
              .sort((a, b) => a.position - b.position)
              .map((l) => l.services)
              .filter((s): s is { title: string; image_url: string } => Boolean(s));
            const image = pkg.image_url || services[0]?.image_url || "";
            return {
              id: pkg.id,
              label: pkg.title,
              cells: [
                <div key="p" className="flex items-center gap-3">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="h-12 w-12 rounded-2xl bg-surface object-cover" />
                  ) : (
                    <span className="h-12 w-12 rounded-2xl bg-surface" />
                  )}
                  <div>
                    <div className="font-serif text-base text-cream">{pkg.title}</div>
                    {pkg.duration ? <div className="text-xs text-muted">{pkg.duration}</div> : null}
                  </div>
                </div>,
                <div key="s">
                  <div className="text-xs text-cream">{services.length} services</div>
                  <div className="line-clamp-2 text-xs text-muted">{services.map((s) => s.title).join(", ")}</div>
                </div>,
                <span key="pr" className="whitespace-nowrap text-gold">
                  {pkg.price}
                </span>,
                <span
                  key="st"
                  className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${
                    pkg.is_published ? "bg-gold text-background" : "bg-surface text-muted"
                  }`}
                >
                  {pkg.is_published ? "Published" : "Hidden"}
                </span>,
                <div key="a" className="flex items-center justify-end gap-4">
                  <Link href={`/packages/${pkg.id}/edit`} className="text-sm text-gold transition hover:text-gold-soft">
                    Edit
                  </Link>
                  <DeletePackageButton id={pkg.id} title={pkg.title} />
                </div>,
              ],
            };
          })}
        />
      ) : null}
    </>
  );
}
