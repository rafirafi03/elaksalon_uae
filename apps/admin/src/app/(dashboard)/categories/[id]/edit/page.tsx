import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import { safeLoad } from "@/lib/safe-load";
import CategoryForm from "../../category-form";
import { updateCategory } from "../../actions";
import { loadServicesForCategory } from "../../data";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Params) {
  await connection();
  const { id } = await params;

  const result = isSupabaseConfigured()
    ? await safeLoad("categories.edit", async () => {
        const supabase = await getAdminSupabase();
        const [{ data, error }, services] = await Promise.all([
          supabase.from("service_categories").select("*").eq("id", id).maybeSingle(),
          loadServicesForCategory(id),
        ]);
        if (error) throw error;
        if (!services) throw new Error("Services failed to load");
        return { category: data, services };
      })
    : ({ ok: false } as const);

  if (!result.ok) {
    return (
      <>
        <PageHeader eyebrow="Catalog" title="Edit category" />
        <ErrorState description={MSG.loadFailed} retryHref="/categories" />
      </>
    );
  }

  const { category, services } = result.value;
  if (!category) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={category.name}
        description="Rename the category, change its image, or choose its services."
      />
      <CategoryForm
        category={category}
        services={services.items}
        selectedServiceIds={services.selected}
        action={updateCategory.bind(null, id)}
        submitLabel="Save changes"
      />
    </>
  );
}
