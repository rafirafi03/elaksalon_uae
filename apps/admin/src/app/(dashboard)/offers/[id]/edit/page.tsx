import { notFound, unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import OfferForm from "../../offer-form";
import { updateOffer } from "../../actions";
import { loadPickItems } from "../../data";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

function Failed() {
  return (
    <>
      <PageHeader eyebrow="Marketing" title="Edit offer" />
      <ErrorState description={MSG.loadFailed} retryHref="/offers" />
    </>
  );
}

export default async function EditOfferPage({ params }: Params) {
  await connection();
  const { id } = await params;
  if (!isSupabaseConfigured()) return <Failed />;

  try {
    const supabase = await getAdminSupabase();
    const [offerRes, productLinks, serviceLinks, items] = await Promise.all([
      supabase.from("offers").select("*").eq("id", id).maybeSingle(),
      supabase.from("offer_products").select("product_id").eq("offer_id", id),
      supabase.from("offer_services").select("service_id").eq("offer_id", id),
      loadPickItems(),
    ]);

    if (offerRes.error || productLinks.error || serviceLinks.error || !items) {
      logAdminError("offers.edit", offerRes.error ?? productLinks.error ?? serviceLinks.error);
      return <Failed />;
    }
    if (!offerRes.data) notFound();

    return (
      <>
        <PageHeader
          eyebrow="Marketing"
          title={offerRes.data.title}
          description="Update the discount, schedule, or the products and services it applies to."
        />
        <OfferForm
          offer={offerRes.data}
          selectedProductIds={(productLinks.data ?? []).map((l) => l.product_id)}
          selectedServiceIds={(serviceLinks.data ?? []).map((l) => l.service_id)}
          products={items.products}
          services={items.services}
          action={updateOffer.bind(null, id)}
          submitLabel="Save changes"
        />
      </>
    );
  } catch (error) {
    unstable_rethrow(error);
    logAdminError("offers.edit", error);
    return <Failed />;
  }
}
