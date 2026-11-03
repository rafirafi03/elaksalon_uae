import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import SpecialistForm from "../../specialist-form";
import { updateSpecialist } from "../../actions";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditSpecialistPage({ params }: Params) {
  await connection();
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageHeader eyebrow="Team" title="Edit specialist" />
        <ErrorState description={MSG.unavailable} retryHref="/specialists" />
      </>
    );
  }

  try {
    const supabase = getAdminSupabase();
    const { data: specialist, error } = await supabase
      .from("specialists")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      logAdminError("specialists.edit", error);
      return (
        <>
          <PageHeader eyebrow="Team" title="Edit specialist" />
          <ErrorState description={MSG.loadFailed} retryHref="/specialists" />
        </>
      );
    }

    if (!specialist) notFound();

    const action = updateSpecialist.bind(null, id);

    return (
      <>
        <PageHeader
          eyebrow="Team"
          title={specialist.name}
          description="Update profile details or replace the portrait."
        />
        <SpecialistForm specialist={specialist} action={action} submitLabel="Save changes" />
      </>
    );
  } catch (error) {
    logAdminError("specialists.edit", error);
    return (
      <>
        <PageHeader eyebrow="Team" title="Edit specialist" />
        <ErrorState description={MSG.loadFailed} retryHref="/specialists" />
      </>
    );
  }
}
