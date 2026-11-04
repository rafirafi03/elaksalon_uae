"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ServiceRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { removeMediaByUrl } from "@/lib/media";
import { slugify } from "@/lib/slug";
import { MSG, logAdminError, saveErrorMessage } from "@/lib/messages";

export type ServiceActionState = {
  error?: string;
  success?: string;
};

function parseLines(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readServiceFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const price_from = String(formData.get("price_from") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const details = parseLines(formData.get("details"));

  if (!title || !category_id || !duration || !price_from || !image_url) {
    return { error: "Please fill in title, category, duration, price, and image." } as const;
  }

  const payload: Omit<ServiceRow, "id" | "created_at" | "updated_at" | "category"> = {
    title,
    category_id,
    duration,
    price_from,
    image_url,
    description,
    details,
    slug: slugify(slugInput || title),
  };

  return { payload } as const;
}

/** Adds the category name (kept on the service as its label). Errors if the category no longer exists. */
async function withCategory(
  supabase: Awaited<ReturnType<typeof getAdminSupabase>>,
  payload: Omit<ServiceRow, "id" | "created_at" | "updated_at" | "category">,
) {
  const { data } = await supabase
    .from("service_categories")
    .select("name")
    .eq("id", payload.category_id ?? "")
    .maybeSingle();
  return data ? { ...payload, category: data.name } : null;
}

export async function createService(
  _prev: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readServiceFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const row = await withCategory(supabase, parsed.payload);
    if (!row) return { error: "Please choose a valid category." };
    const { error } = await supabase.from("services").insert(row);
    if (error) {
      logAdminError("createService", error);
      return { error: saveErrorMessage(error) };
    }
  } catch (error) {
    logAdminError("createService", error);
    return { error: saveErrorMessage(error) };
  }

  revalidatePath("/services");
  redirect("/services");
}

export async function updateService(
  id: string,
  _prev: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readServiceFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const row = await withCategory(supabase, parsed.payload);
    if (!row) return { error: "Please choose a valid category." };
    const { data: before } = await supabase.from("services").select("image_url").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("services")
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error && before?.image_url !== parsed.payload.image_url) await removeMediaByUrl(supabase, before?.image_url);

    if (error) {
      logAdminError("updateService", error);
      return { error: saveErrorMessage(error) };
    }
  } catch (error) {
    logAdminError("updateService", error);
    return { error: saveErrorMessage(error) };
  }

  revalidatePath("/services");
  revalidatePath(`/services/${id}/edit`);
  redirect("/services");
}

export async function deleteService(id: string): Promise<ServiceActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  try {
    const supabase = await getAdminSupabase();
    const { data: deleted, error } = await supabase.from("services").delete().eq("id", id).select("image_url");
    if (!error && !deleted?.length) return { error: MSG.deleteFailed };
    if (!error) for (const row of deleted ?? []) await removeMediaByUrl(supabase, row.image_url);
    if (error) {
      logAdminError("deleteService", error);
      return { error: MSG.deleteFailed };
    }
  } catch (error) {
    logAdminError("deleteService", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/services");
  return { success: "Service deleted." };
}

/** Saves a new manual order (drag & drop). Index in `ids` becomes sort_order. */
export async function reorderServices(ids: string[]): Promise<ServiceActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) return { error: MSG.saveFailed };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.rpc("set_sort_order", { p_table: "services", p_ids: ids });
    if (error) {
      logAdminError("reorderServices", error);
      return { error: "We couldn't save the new order. Please try again." };
    }
  } catch (error) {
    logAdminError("reorderServices", error);
    return { error: "We couldn't save the new order. Please try again." };
  }

  revalidatePath("/services");
  return { success: "Order saved." };
}

/** Deletes several services at once (and their uploaded images). */
export async function bulkDeleteServices(ids: string[]): Promise<ServiceActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.length === 0) return { error: MSG.deleteFailed };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("services").delete().in("id", ids).select("image_url");
    if (error || !data?.length) {
      if (error) logAdminError("bulkDeleteServices", error);
      return { error: MSG.deleteFailed };
    }
    await Promise.all(data.map((row) => removeMediaByUrl(supabase, row.image_url)));
  } catch (error) {
    logAdminError("bulkDeleteServices", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/services");
  return { success: "Deleted." };
}
