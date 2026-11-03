import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import ServiceForm from "../../service-form";
import { updateService } from "../../actions";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Params) {
  await connection();
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageHeader eyebrow="Catalog" title="Edit service" />
        <ErrorState description={MSG.unavailable} retryHref="/services" />
      </>
    );
  }

  try {
    const supabase = getAdminSupabase();
    const { data: service, error } = await supabase.from("services").select("*").eq("id", id).maybeSingle();

    if (error) {
      logAdminError("services.edit", error);
      return (
        <>
          <PageHeader eyebrow="Catalog" title="Edit service" />
          <ErrorState description={MSG.loadFailed} retryHref="/services" />
        </>
      );
    }

    if (!service) notFound();

    const action = updateService.bind(null, id);

    return (
      <>
        <PageHeader
          eyebrow="Catalog"
          title={service.title}
          description="Update service details or replace the image."
        />
        <ServiceForm service={service} action={action} submitLabel="Save changes" />
      </>
    );
  } catch (error) {
    logAdminError("services.edit", error);
    return (
      <>
        <PageHeader eyebrow="Catalog" title="Edit service" />
        <ErrorState description={MSG.loadFailed} retryHref="/services" />
      </>
    );
  }
}
