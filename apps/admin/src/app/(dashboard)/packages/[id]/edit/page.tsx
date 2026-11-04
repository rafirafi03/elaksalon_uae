import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import { safeLoad } from "@/lib/safe-load";
import PackageForm from "../../package-form";
import { updatePackage } from "../../actions";
import { loadServiceItems } from "../../data";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditPackagePage({ params }: Params) {
  await connection();
  const { id } = await params;

  const result = isSupabaseConfigured()
    ? await safeLoad("packages.edit", async () => {
        const supabase = await getAdminSupabase();
        const [pkgRes, linksRes, services] = await Promise.all([
          supabase.from("packages").select("*").eq("id", id).maybeSingle(),
          supabase.from("package_services").select("service_id, position").eq("package_id", id).order("position"),
          loadServiceItems(),
        ]);
        const error = pkgRes.error ?? linksRes.error;
        if (error) throw error;
        if (!services) throw new Error("Services failed to load");
        return { pkg: pkgRes.data, serviceIds: (linksRes.data ?? []).map((l) => l.service_id), services };
      })
    : ({ ok: false } as const);

  if (!result.ok) {
    return (
      <>
        <PageHeader eyebrow="Catalog" title="Edit package" />
        <ErrorState description={MSG.loadFailed} retryHref="/packages" />
      </>
    );
  }

  const { pkg, serviceIds, services } = result.value;
  if (!pkg) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={pkg.title}
        description="Update the package details, price, or included services."
      />
      <PackageForm
        pkg={pkg}
        selectedServiceIds={serviceIds}
        services={services}
        action={updatePackage.bind(null, id)}
        submitLabel="Save changes"
      />
    </>
  );
}
