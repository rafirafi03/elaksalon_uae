import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import type { SpecialistRow } from "@elak/db";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import DeleteSpecialistButton from "./delete-button";
import SortableTable from "@/components/admin/SortableTable";
import { bulkDeleteSpecialists, reorderSpecialists } from "./actions";

export const instant = false;

export default async function AdminSpecialistsPage() {
  await connection();

  let specialists: SpecialistRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = await getAdminSupabase();
      const { data, error } = await supabase
        .from("specialists")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        logAdminError("specialists.list", error);
        failed = true;
      } else {
        specialists = data ?? [];
      }
    } catch (error) {
      logAdminError("specialists.list", error);
      failed = true;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Specialists"
        description="Manage team profiles shown on the public specialists page."
        action={
          <Link
            href="/specialists/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background transition hover:bg-gold-soft"
          >
            <Plus size={16} />
            Add specialist
          </Link>
        }
      />

      {failed ? <ErrorState description={MSG.loadFailed} retryHref="/specialists" /> : null}

      {!failed && specialists.length === 0 ? (
        <EmptyState
          title="No specialists yet"
          description="Add your first team member to show them on the public site."
          actionHref="/specialists/new"
          actionLabel="Add specialist"
        />
      ) : null}

      {!failed && specialists.length > 0 ? (
        <SortableTable
          itemType="specialist"
          itemTypePlural="specialists"
          onReorder={reorderSpecialists}
          onBulkDelete={bulkDeleteSpecialists}
          columns={[
            { label: "Specialist" },
            { label: "Role" },
            { label: "Specialty" },
            { label: "Experience" },
            { label: "Actions", className: "pr-5 text-right" },
          ]}
          rows={specialists.map((person) => ({
            id: person.id,
            label: person.name,
            cells: [
              <div key="n" className="flex items-center gap-3">
                {person.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.image_url}
                    alt=""
                    className="h-12 w-12 rounded-full bg-surface object-cover object-top"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-surface font-serif text-gold">
                    {person.name.trim().split(/s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                )}
                <div className="font-serif text-base text-cream">{person.name}</div>
              </div>,
              <span key="r" className="text-gold">{person.role}</span>,
              <span key="s" className="text-muted">{person.specialty}</span>,
              <span key="e" className="text-muted">{person.experience}</span>,
              <div key="a" className="flex items-center justify-end gap-4">
                <Link
                  href={`/specialists/${person.id}/edit`}
                  className="text-sm text-gold transition hover:text-gold-soft"
                >
                  Edit
                </Link>
                <DeleteSpecialistButton id={person.id} name={person.name} />
              </div>,
            ],
          }))}
        />
      ) : null}
    </>
  );
}
