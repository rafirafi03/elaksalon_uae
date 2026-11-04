"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { removeMediaByUrl } from "@/lib/media";
import { slugify } from "@/lib/slug";
import { MSG, logAdminError, saveErrorMessage } from "@/lib/messages";

export type ProductActionState = {
  error?: string;
  success?: string;
};

function parseDetails(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const details = parseDetails(formData.get("details"));

  if (!name || !brand || !price || !category || !image_url) {
    return { error: "Please fill in name, brand, price, category, and image." } as const;
  }

  const payload: Omit<ProductRow, "id" | "created_at" | "updated_at"> = {
    name,
    brand,
    price,
    category,
    image_url,
    description,
    details,
    slug: slugify(slugInput || name),
  };

  return { payload } as const;
}

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readProductFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from("products").insert(parsed.payload);
    if (error) {
      logAdminError("createProduct", error);
      return { error: saveErrorMessage(error) };
    }
  } catch (error) {
    logAdminError("createProduct", error);
    return { error: saveErrorMessage(error) };
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readProductFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { data: before } = await supabase.from("products").select("image_url").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("products")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error && before?.image_url !== parsed.payload.image_url) await removeMediaByUrl(supabase, before?.image_url);

    if (error) {
      logAdminError("updateProduct", error);
      return { error: saveErrorMessage(error) };
    }
  } catch (error) {
    logAdminError("updateProduct", error);
    return { error: saveErrorMessage(error) };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}/edit`);
  redirect("/products");
}

export async function deleteProduct(id: string): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  try {
    const supabase = await getAdminSupabase();
    const { data: deleted, error } = await supabase.from("products").delete().eq("id", id).select("image_url");
    if (!error && !deleted?.length) return { error: MSG.deleteFailed };
    if (!error) for (const row of deleted ?? []) await removeMediaByUrl(supabase, row.image_url);
    if (error) {
      logAdminError("deleteProduct", error);
      return { error: MSG.deleteFailed };
    }
  } catch (error) {
    logAdminError("deleteProduct", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/products");
  return { success: "Product deleted." };
}

/** Saves a new manual order (drag & drop). Index in `ids` becomes sort_order. */
export async function reorderProducts(ids: string[]): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) return { error: MSG.saveFailed };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.rpc("set_sort_order", { p_table: "products", p_ids: ids });
    if (error) {
      logAdminError("reorderProducts", error);
      return { error: "We couldn't save the new order. Please try again." };
    }
  } catch (error) {
    logAdminError("reorderProducts", error);
    return { error: "We couldn't save the new order. Please try again." };
  }

  revalidatePath("/products");
  return { success: "Order saved." };
}

/** Deletes several products at once (and their uploaded images). */
export async function bulkDeleteProducts(ids: string[]): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.length === 0) return { error: MSG.deleteFailed };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("products").delete().in("id", ids).select("image_url");
    if (error || !data?.length) {
      if (error) logAdminError("bulkDeleteProducts", error);
      return { error: MSG.deleteFailed };
    }
    await Promise.all(data.map((row) => removeMediaByUrl(supabase, row.image_url)));
  } catch (error) {
    logAdminError("bulkDeleteProducts", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/products");
  return { success: "Deleted." };
}
