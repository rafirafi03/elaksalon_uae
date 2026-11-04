"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ReviewRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { removeMediaByUrl } from "@/lib/media";
import { MSG, logAdminError, saveErrorMessage } from "@/lib/messages";

export type ReviewActionState = {
  error?: string;
  success?: string;
};

function readReviewFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const role = String(formData.get("role") ?? "").trim().slice(0, 120);
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 1000);
  const image_url = String(formData.get("image_url") ?? "").trim();
  const rating = Math.round(Number(formData.get("rating")));
  const is_published = formData.get("is_published") === "on";

  if (!name || !comment) return { error: "Please fill in the customer name and review." } as const;
  if (!(rating >= 1 && rating <= 5)) return { error: "Rating must be between 1 and 5." } as const;

  const payload: Omit<ReviewRow, "id" | "created_at" | "updated_at" | "sort_order"> = {
    name,
    role,
    comment,
    image_url,
    rating,
    is_published,
  };
  return { payload } as const;
}

export async function createReview(_prev: ReviewActionState, formData: FormData): Promise<ReviewActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readReviewFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from("reviews").insert(parsed.payload);
    if (error) {
      logAdminError("createReview", error);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("createReview", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/reviews");
  redirect("/reviews");
}

export async function updateReview(
  id: string,
  _prev: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readReviewFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { data: before } = await supabase.from("reviews").select("image_url").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("reviews")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      logAdminError("updateReview", error);
      return { error: MSG.saveFailed };
    }
    if (before?.image_url && before.image_url !== parsed.payload.image_url) {
      await removeMediaByUrl(supabase, before.image_url);
    }
  } catch (error) {
    logAdminError("updateReview", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/reviews");
  revalidatePath(`/reviews/${id}/edit`);
  redirect("/reviews");
}

export async function deleteReview(id: string): Promise<ReviewActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("reviews").delete().eq("id", id).select("image_url");
    if (error || !data?.length) {
      if (error) logAdminError("deleteReview", error);
      return { error: MSG.deleteFailed };
    }
    for (const row of data) await removeMediaByUrl(supabase, row.image_url);
  } catch (error) {
    logAdminError("deleteReview", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/reviews");
  return { success: "Review deleted." };
}

/** Saves the public Google reviews link (shown as "View more on Google" on the site). Empty clears it. */
export async function saveGoogleReviewsUrl(
  _prev: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const url = String(formData.get("google_reviews_url") ?? "").trim();
  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("bad protocol");
    } catch {
      return { error: "Please enter a valid link starting with https://" };
    }
  }

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase
      .from("company_settings")
      .upsert({ id: 1, google_reviews_url: url, updated_at: new Date().toISOString() });
    if (error) {
      logAdminError("saveGoogleReviewsUrl", error);
      return { error: saveErrorMessage(error) };
    }
  } catch (error) {
    logAdminError("saveGoogleReviewsUrl", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/reviews");
  return { success: url ? "Google reviews link saved." : "Google reviews link removed." };
}

/** Saves a new manual order (drag & drop). Index in `ids` becomes sort_order. */
export async function reorderReviews(ids: string[]): Promise<ReviewActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) return { error: MSG.saveFailed };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.rpc("set_sort_order", { p_table: "reviews", p_ids: ids });
    if (error) {
      logAdminError("reorderReviews", error);
      return { error: "We couldn't save the new order. Please try again." };
    }
  } catch (error) {
    logAdminError("reorderReviews", error);
    return { error: "We couldn't save the new order. Please try again." };
  }

  revalidatePath("/reviews");
  return { success: "Order saved." };
}

/** Deletes several reviews at once (and their uploaded photos). */
export async function bulkDeleteReviews(ids: string[]): Promise<ReviewActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.length === 0) return { error: MSG.deleteFailed };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("reviews").delete().in("id", ids).select("image_url");
    if (error || !data?.length) {
      if (error) logAdminError("bulkDeleteReviews", error);
      return { error: MSG.deleteFailed };
    }
    await Promise.all(data.map((row) => removeMediaByUrl(supabase, row.image_url)));
  } catch (error) {
    logAdminError("bulkDeleteReviews", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/reviews");
  return { success: "Deleted." };
}
