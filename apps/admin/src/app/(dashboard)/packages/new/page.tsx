import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import PackageForm from "../package-form";
import { createPackage } from "../actions";
import { loadServiceItems } from "../data";

export const instant = false;

export default async function NewPackagePage() {
  await connection();
  const services = isSupabaseConfigured() ? await loadServiceItems() : null;

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Add package"
        description="Combine two or more services and set a package price."
      />
      {services ? (
        <PackageForm services={services} action={createPackage} submitLabel="Create package" />
      ) : (
        <ErrorState description={MSG.loadFailed} retryHref="/packages/new" />
      )}
    </>
  );
}
