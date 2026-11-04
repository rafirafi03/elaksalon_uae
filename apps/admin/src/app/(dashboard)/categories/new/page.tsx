import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import CategoryForm from "../category-form";
import { createCategory } from "../actions";
import { loadServicesForCategory } from "../data";

export const instant = false;

export default async function NewCategoryPage() {
  await connection();
  const services = isSupabaseConfigured() ? await loadServicesForCategory() : null;

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Add category"
        description="A name and image for the home page carousel, plus the services it contains."
      />
      {services ? (
        <CategoryForm services={services.items} action={createCategory} submitLabel="Create category" />
      ) : (
        <ErrorState description={MSG.loadFailed} retryHref="/categories/new" />
      )}
    </>
  );
}
