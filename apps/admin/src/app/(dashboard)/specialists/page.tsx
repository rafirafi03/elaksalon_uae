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

export const instant = false;

export default async function AdminSpecialistsPage() {
  await connection();

  let specialists: SpecialistRow[] = [];
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = getAdminSupabase();
      const { data, error } = await supabase
        .from("specialists")
        .select("*")
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
        <div className="overflow-hidden rounded-[1.75rem] bg-surface-elevated">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/70 text-[10px] tracking-[0.2em] text-muted uppercase">
                  <th className="px-5 py-4 font-medium">Specialist</th>
                  <th className="px-4 py-4 font-medium">Role</th>
                  <th className="px-4 py-4 font-medium">Specialty</th>
                  <th className="px-4 py-4 font-medium">Experience</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialists.map((person) => (
                  <tr key={person.id} className="border-t border-border/50 transition hover:bg-surface">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={person.image_url}
                          alt=""
                          className="h-12 w-12 rounded-full bg-surface object-cover object-top"
                        />
                        <div className="font-serif text-base text-cream">{person.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gold">{person.role}</td>
                    <td className="px-4 py-4 text-muted">{person.specialty}</td>
                    <td className="px-4 py-4 text-muted">{person.experience}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/specialists/${person.id}/edit`}
                          className="text-sm text-gold transition hover:text-gold-soft"
                        >
                          Edit
                        </Link>
                        <DeleteSpecialistButton id={person.id} name={person.name} />
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
