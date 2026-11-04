import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import ServiceForm from "../service-form";
import { createService } from "../actions";
import { loadCategoryOptions } from "../data";

export const instant = false;

export default async function NewServicePage() {
  await connection();
  const categories = isSupabaseConfigured() ? await loadCategoryOptions() : null;

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Add service"
        description="Upload imagery and details for a public service page."
      />
      {categories ? (
        <ServiceForm categories={categories} action={createService} submitLabel="Create service" />
      ) : (
        <ErrorState description={MSG.loadFailed} retryHref="/services/new" />
      )}
    </>
  );
}
