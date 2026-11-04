import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import { safeLoad } from "@/lib/safe-load";
import OfferForm from "../../offer-form";
import { updateOffer } from "../../actions";
import { loadPickItems } from "../../data";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditOfferPage({ params }: Params) {
  await connection();
  const { id } = await params;

  const result = isSupabaseConfigured()
    ? await safeLoad("offers.edit", async () => {
        const supabase = await getAdminSupabase();
        const [offerRes, productLinks, serviceLinks, items] = await Promise.all([
          supabase.from("offers").select("*").eq("id", id).maybeSingle(),
          supabase.from("offer_products").select("product_id").eq("offer_id", id),
          supabase.from("offer_services").select("service_id").eq("offer_id", id),
          loadPickItems(),
        ]);
        const error = offerRes.error ?? productLinks.error ?? serviceLinks.error;
        if (error) throw error;
        if (!items) throw new Error("Products/services failed to load");
        return {
          offer: offerRes.data,
          productIds: (productLinks.data ?? []).map((l) => l.product_id),
          serviceIds: (serviceLinks.data ?? []).map((l) => l.service_id),
          items,
        };
      })
    : ({ ok: false } as const);

  if (!result.ok) {
    return (
      <>
        <PageHeader eyebrow="Marketing" title="Edit offer" />
        <ErrorState description={MSG.loadFailed} retryHref="/offers" />
      </>
    );
  }

  const { offer, productIds, serviceIds, items } = result.value;
  if (!offer) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title={offer.title}
        description="Update the discount, schedule, or the products and services it applies to."
      />
      <OfferForm
        offer={offer}
        selectedProductIds={productIds}
        selectedServiceIds={serviceIds}
        products={items.products}
        services={items.services}
        action={updateOffer.bind(null, id)}
        submitLabel="Save changes"
      />
    </>
  );
}
