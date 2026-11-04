import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import OfferForm from "../offer-form";
import { createOffer } from "../actions";
import { loadPickItems } from "../data";

export const instant = false;

export default async function NewOfferPage() {
  await connection();
  const items = isSupabaseConfigured() ? await loadPickItems() : null;

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title="Add offer"
        description="Set a discount, schedule it, and choose which products and services it applies to."
      />
      {items ? (
        <OfferForm
          products={items.products}
          services={items.services}
          action={createOffer}
          submitLabel="Create offer"
        />
      ) : (
        <ErrorState description={MSG.loadFailed} retryHref="/offers/new" />
      )}
    </>
  );
}
