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

export const instant = false;

export default async function AdminServicesPage() {
  await connection();

  let services: ServiceRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = getAdminSupabase();
      const { data, error } = await supabase
        .from("services")
        .select("*")
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
        <div className="overflow-hidden rounded-[1.75rem] bg-surface-elevated">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/70 text-[10px] tracking-[0.2em] text-muted uppercase">
                  <th className="px-5 py-4 font-medium">Service</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Duration</th>
                  <th className="px-4 py-4 font-medium">From</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-t border-border/50 transition hover:bg-surface">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.image_url}
                          alt=""
                          className="h-12 w-12 rounded-2xl bg-surface object-cover"
                        />
                        <div>
                          <div className="font-serif text-base text-cream">{service.title}</div>
                          <div className="line-clamp-1 text-xs text-muted">{service.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted">{service.category}</td>
                    <td className="px-4 py-4 text-muted">{service.duration}</td>
                    <td className="px-4 py-4 text-gold">{service.price_from}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/services/${service.id}/edit`}
                          className="text-sm text-gold transition hover:text-gold-soft"
                        >
                          Edit
                        </Link>
                        <DeleteServiceButton id={service.id} title={service.title} />
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
