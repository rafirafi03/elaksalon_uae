import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import { safeLoad } from "@/lib/safe-load";
import SpecialistForm from "../../specialist-form";
import { updateSpecialist } from "../../actions";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditSpecialistPage({ params }: Params) {
  await connection();
  const { id } = await params;

  const result = isSupabaseConfigured()
    ? await safeLoad("specialists.edit", async () => {
        const supabase = await getAdminSupabase();
        const { data, error } = await supabase.from("specialists").select("*").eq("id", id).maybeSingle();
        if (error) throw error;
        return data;
      })
    : ({ ok: false } as const);

  if (!result.ok) {
    return (
      <>
        <PageHeader eyebrow="Team" title="Edit specialist" />
        <ErrorState description={MSG.loadFailed} retryHref="/specialists" />
      </>
    );
  }

  const specialist = result.value;
  if (!specialist) notFound();

  return (
    <>
      <PageHeader eyebrow="Team" title={specialist.name} description="Update profile details or replace the portrait." />
      <SpecialistForm specialist={specialist} action={updateSpecialist.bind(null, id)} submitLabel="Save changes" />
    </>
  );
}
