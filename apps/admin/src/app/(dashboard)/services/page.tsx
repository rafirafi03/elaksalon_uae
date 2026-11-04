import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import type { ServiceRow } from "@elak/db";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import DeleteServiceButton from "./delete-button";
import SortableTable from "@/components/admin/SortableTable";
import { bulkDeleteServices, reorderServices } from "./actions";

export const instant = false;

export default async function AdminServicesPage() {
  await connection();

  let services: ServiceRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = await getAdminSupabase();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        logAdminError("services.list", error);
        failed = true;
      } else {
        services = data ?? [];
      }
    } catch (error) {
      logAdminError("services.list", error);
      failed = true;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Services"
        description="Manage grooming services shown on the public site."
        action={
          <Link
            href="/services/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background transition hover:bg-gold-soft"
          >
            <Plus size={16} />
            Add service
          </Link>
        }
      />

      {failed ? <ErrorState description={MSG.loadFailed} retryHref="/services" /> : null}

      {!failed && services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Add your first service to show it on the public site."
          actionHref="/services/new"
          actionLabel="Add service"
        />
      ) : null}

      {!failed && services.length > 0 ? (
        <SortableTable
          itemType="service"
          itemTypePlural="services"
          onReorder={reorderServices}
          onBulkDelete={bulkDeleteServices}
          columns={[
            { label: "Service" },
            { label: "Category" },
            { label: "Duration" },
            { label: "Price" },
            { label: "Actions", className: "pr-5 text-right" },
          ]}
          rows={services.map((service) => ({
            id: service.id,
            label: service.title,
            cells: [
              <div key="s" className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.image_url} alt="" className="h-12 w-12 rounded-2xl bg-surface object-cover" />
                <div>
                  <div className="font-serif text-base text-cream">{service.title}</div>
                  <div className="line-clamp-1 text-xs text-muted">{service.description}</div>
                </div>
              </div>,
              <span key="c" className="text-muted">{service.category}</span>,
              <span key="d" className="text-muted">{service.duration}</span>,
              <span key="p" className="text-gold">{service.price_from}</span>,
              <div key="a" className="flex items-center justify-end gap-4">
                <Link href={`/services/${service.id}/edit`} className="text-sm text-gold transition hover:text-gold-soft">
                  Edit
                </Link>
                <DeleteServiceButton id={service.id} title={service.title} />
              </div>,
            ],
          }))}
        />
      ) : null}
    </>
  );
}
