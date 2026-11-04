import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import { safeLoad } from "@/lib/safe-load";
import ServiceForm from "../../service-form";
import { updateService } from "../../actions";
import { loadCategoryOptions } from "../../data";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Params) {
  await connection();
  const { id } = await params;

  const result = isSupabaseConfigured()
    ? await safeLoad("services.edit", async () => {
        const supabase = await getAdminSupabase();
        const [{ data, error }, categories] = await Promise.all([
          supabase.from("services").select("*").eq("id", id).maybeSingle(),
          loadCategoryOptions(),
        ]);
        if (error) throw error;
        if (!categories) throw new Error("Categories failed to load");
        return { service: data, categories };
      })
    : ({ ok: false } as const);

  if (!result.ok) {
    return (
      <>
        <PageHeader eyebrow="Catalog" title="Edit service" />
        <ErrorState description={MSG.loadFailed} retryHref="/services" />
      </>
    );
  }

  const { service, categories } = result.value;
  if (!service) notFound();

  return (
    <>
      <PageHeader eyebrow="Catalog" title={service.title} description="Update details or replace the service image." />
      <ServiceForm
        service={service}
        categories={categories}
        action={updateService.bind(null, id)}
        submitLabel="Save changes"
      />
    </>
  );
}
