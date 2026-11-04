import { notFound, unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import PackageForm from "../../package-form";
import { updatePackage } from "../../actions";
import { loadServiceItems } from "../../data";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

function Failed() {
  return (
    <>
      <PageHeader eyebrow="Catalog" title="Edit package" />
      <ErrorState description={MSG.loadFailed} retryHref="/packages" />
    </>
  );
}

export default async function EditPackagePage({ params }: Params) {
  await connection();
  const { id } = await params;
  if (!isSupabaseConfigured()) return <Failed />;

  try {
    const supabase = await getAdminSupabase();
    const [pkgRes, linksRes, services] = await Promise.all([
      supabase.from("packages").select("*").eq("id", id).maybeSingle(),
      supabase.from("package_services").select("service_id, position").eq("package_id", id).order("position"),
      loadServiceItems(),
    ]);

    if (pkgRes.error || linksRes.error || !services) {
      logAdminError("packages.edit", pkgRes.error ?? linksRes.error);
      return <Failed />;
    }
    if (!pkgRes.data) notFound();

    return (
      <>
        <PageHeader
          eyebrow="Catalog"
          title={pkgRes.data.title}
          description="Update the package details, price, or included services."
        />
        <PackageForm
          pkg={pkgRes.data}
          selectedServiceIds={(linksRes.data ?? []).map((l) => l.service_id)}
          services={services}
          action={updatePackage.bind(null, id)}
          submitLabel="Save changes"
        />
      </>
    );
  } catch (error) {
    unstable_rethrow(error);
    logAdminError("packages.edit", error);
    return <Failed />;
  }
}
