import { notFound, unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import CategoryForm from "../../category-form";
import { updateCategory } from "../../actions";
import { loadServicesForCategory } from "../../data";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

function Failed() {
  return (
    <>
      <PageHeader eyebrow="Catalog" title="Edit category" />
      <ErrorState description={MSG.loadFailed} retryHref="/categories" />
    </>
  );
}

export default async function EditCategoryPage({ params }: Params) {
  await connection();
  const { id } = await params;
  if (!isSupabaseConfigured()) return <Failed />;

  try {
    const supabase = await getAdminSupabase();
    const [{ data: category, error }, services] = await Promise.all([
      supabase.from("service_categories").select("*").eq("id", id).maybeSingle(),
      loadServicesForCategory(id),
    ]);
    if (error || !services) {
      logAdminError("categories.edit", error);
      return <Failed />;
    }
    if (!category) notFound();

    return (
      <>
        <PageHeader eyebrow="Catalog" title={category.name} description="Rename the category, change its image, or choose its services." />
        <CategoryForm
          category={category}
          services={services.items}
          selectedServiceIds={services.selected}
          action={updateCategory.bind(null, id)}
          submitLabel="Save changes"
        />
      </>
    );
  } catch (error) {
    unstable_rethrow(error);
    logAdminError("categories.edit", error);
    return <Failed />;
  }
}
