"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { removeMediaByUrl } from "@/lib/media";
import { slugify } from "@/lib/slug";
import { MSG, logAdminError, saveErrorMessage } from "@/lib/messages";

export type CategoryActionState = {
  error?: string;
  success?: string;
};

function readCategoryFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const image_url = String(formData.get("image_url") ?? "").trim();
  if (!name) return { error: "Please enter a category name." } as const;
  if (!image_url) return { error: "Please upload a category image." } as const;
  const serviceIds = [...new Set(formData.getAll("service_ids").map(String).filter(Boolean))];
  return { payload: { name, slug: slugify(name), image_url }, serviceIds } as const;
}

/**
 * Makes `serviceIds` exactly the services of this category: selected ones are moved here
 * (from any other category), unselected ones that were here become uncategorised.
 */
async function syncServices(
  supabase: Awaited<ReturnType<typeof getAdminSupabase>>,
  categoryId: string,
  name: string,
  serviceIds: string[],
) {
  const removeQuery = supabase.from("services").update({ category_id: null }).eq("category_id", categoryId);
  const removed = serviceIds.length
    ? await removeQuery.not("id", "in", `(${serviceIds.join(",")})`)
    : await removeQuery;
  if (removed.error) return removed.error;

  if (serviceIds.length) {
    const { error } = await supabase
      .from("services")
      .update({ category_id: categoryId, category: name })
      .in("id", serviceIds);
    if (error) return error;
  }
  return null;
}

function duplicateAware(error: unknown) {
  return (error as { code?: string } | null)?.code === "23505"
    ? "A category with this name already exists."
    : saveErrorMessage(error);
}

export async function createCategory(_prev: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readCategoryFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("service_categories").insert(parsed.payload).select("id").single();
    if (error || !data) {
      logAdminError("createCategory", error);
      return { error: duplicateAware(error) };
    }

    const syncError = await syncServices(supabase, data.id, parsed.payload.name, parsed.serviceIds);
    if (syncError) {
      logAdminError("createCategory.services", syncError);
      return { error: "The category was created, but its services couldn't be updated. Please edit it and save again." };
    }
  } catch (error) {
    logAdminError("createCategory", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/categories");
  revalidatePath("/services");
  redirect("/categories");
}

export async function updateCategory(
  id: string,
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readCategoryFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { data: before } = await supabase.from("service_categories").select("image_url").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("service_categories")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      logAdminError("updateCategory", error);
      return { error: duplicateAware(error) };
    }

    // Assign the selected services (also keeps their category label in sync with a rename).
    const syncError = await syncServices(supabase, id, parsed.payload.name, parsed.serviceIds);
    if (syncError) {
      logAdminError("updateCategory.services", syncError);
      return { error: saveErrorMessage(syncError) };
    }

    if (before?.image_url && before.image_url !== parsed.payload.image_url) {
      await removeMediaByUrl(supabase, before.image_url);
    }
  } catch (error) {
    logAdminError("updateCategory", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/categories");
  revalidatePath("/services");
  redirect("/categories");
}

export async function deleteCategory(id: string): Promise<CategoryActionState> {
  return bulkDeleteCategories([id]);
}

/** Deletes categories. Their services stay, but become uncategorised. */
export async function bulkDeleteCategories(ids: string[]): Promise<CategoryActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.length === 0) return { error: MSG.deleteFailed };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("service_categories").delete().in("id", ids).select("image_url");
    if (error || !data?.length) {
      if (error) logAdminError("deleteCategories", error);
      return { error: MSG.deleteFailed };
    }
    await Promise.all(data.map((row) => removeMediaByUrl(supabase, row.image_url)));
  } catch (error) {
    logAdminError("deleteCategories", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/categories");
  revalidatePath("/services");
  return { success: "Deleted." };
}

export async function reorderCategories(ids: string[]): Promise<CategoryActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) return { error: MSG.saveFailed };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.rpc("set_sort_order", { p_table: "service_categories", p_ids: ids });
    if (error) {
      logAdminError("reorderCategories", error);
      return { error: "We couldn't save the new order. Please try again." };
    }
  } catch (error) {
    logAdminError("reorderCategories", error);
    return { error: "We couldn't save the new order. Please try again." };
  }

  revalidatePath("/categories");
  return { success: "Order saved." };
}
