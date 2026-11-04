"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OfferRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { MSG, logAdminError } from "@/lib/messages";
import { revalidateSite } from "@/lib/site-revalidate";

export type OfferActionState = {
  error?: string;
  success?: string;
};

type OfferPayload = Omit<OfferRow, "id" | "created_at" | "updated_at">;

function readOfferFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const discount_type = String(formData.get("discount_type") ?? "percent") === "fixed" ? "fixed" : "percent";
  const discount_value = Number(formData.get("discount_value"));
  const starts_at = String(formData.get("starts_at") ?? "");
  const ends_at = String(formData.get("ends_at") ?? "");
  const is_active = formData.get("is_active") === "on";
  const productIds = formData.getAll("product_ids").map(String).filter(Boolean);
  const serviceIds = formData.getAll("service_ids").map(String).filter(Boolean);

  if (!title) return { error: "Please enter an offer title." } as const;
  if (!Number.isFinite(discount_value) || discount_value <= 0) {
    return { error: "Please enter a discount greater than 0." } as const;
  }
  if (discount_type === "percent" && discount_value > 100) {
    return { error: "A percentage discount cannot be more than 100%." } as const;
  }

  const start = Date.parse(starts_at);
  const end = Date.parse(ends_at);
  if (Number.isNaN(start) || Number.isNaN(end)) return { error: "Please choose a start and end date/time." } as const;
  if (end <= start) return { error: "The end date/time must be after the start." } as const;

  if (productIds.length === 0 && serviceIds.length === 0) {
    return { error: "Select at least one product or service for this offer." } as const;
  }

  const payload: OfferPayload = {
    title,
    description,
    discount_type,
    discount_value,
    starts_at: new Date(start).toISOString(),
    ends_at: new Date(end).toISOString(),
    is_active,
  };

  return { payload, productIds, serviceIds } as const;
}

type Supabase = Awaited<ReturnType<typeof getAdminSupabase>>;

/** Replaces the product/service links of an offer. */
async function saveLinks(supabase: Supabase, offerId: string, productIds: string[], serviceIds: string[]) {
  const delP = await supabase.from("offer_products").delete().eq("offer_id", offerId);
  if (delP.error) return delP.error;
  const delS = await supabase.from("offer_services").delete().eq("offer_id", offerId);
  if (delS.error) return delS.error;

  if (productIds.length) {
    const { error } = await supabase
      .from("offer_products")
      .insert(productIds.map((product_id) => ({ offer_id: offerId, product_id })));
    if (error) return error;
  }
  if (serviceIds.length) {
    const { error } = await supabase
      .from("offer_services")
      .insert(serviceIds.map((service_id) => ({ offer_id: offerId, service_id })));
    if (error) return error;
  }
  return null;
}

export async function createOffer(_prev: OfferActionState, formData: FormData): Promise<OfferActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readOfferFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("offers").insert(parsed.payload).select("id").single();
    if (error || !data) {
      logAdminError("createOffer", error);
      return { error: MSG.saveFailed };
    }

    const linkError = await saveLinks(supabase, data.id, parsed.productIds, parsed.serviceIds);
    if (linkError) {
      logAdminError("createOffer.links", linkError);
      await supabase.from("offers").delete().eq("id", data.id);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("createOffer", error);
    return { error: MSG.saveFailed };
  }

  await revalidateSite(["offers"]);
  revalidatePath("/offers");
  redirect("/offers");
}

export async function updateOffer(
  id: string,
  _prev: OfferActionState,
  formData: FormData,
): Promise<OfferActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readOfferFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase
      .from("offers")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      logAdminError("updateOffer", error);
      return { error: MSG.saveFailed };
    }

    const linkError = await saveLinks(supabase, id, parsed.productIds, parsed.serviceIds);
    if (linkError) {
      logAdminError("updateOffer.links", linkError);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("updateOffer", error);
    return { error: MSG.saveFailed };
  }

  await revalidateSite(["offers"]);
  revalidatePath("/offers");
  revalidatePath(`/offers/${id}/edit`);
  redirect("/offers");
}

export async function deleteOffer(id: string): Promise<OfferActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  try {
    const supabase = await getAdminSupabase();
    // offer_products / offer_services rows are removed by ON DELETE CASCADE.
    const { data, error } = await supabase.from("offers").delete().eq("id", id).select("id");
    if (error || !data?.length) {
      if (error) logAdminError("deleteOffer", error);
      return { error: MSG.deleteFailed };
    }
  } catch (error) {
    logAdminError("deleteOffer", error);
    return { error: MSG.deleteFailed };
  }

  await revalidateSite(["offers"]);
  revalidatePath("/offers");
  return { success: "Offer deleted." };
}
