"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PackageRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { removeMediaByUrl } from "@/lib/media";
import { slugify } from "@/lib/slug";
import { MSG, logAdminError, saveErrorMessage } from "@/lib/messages";

export type PackageActionState = {
  error?: string;
  success?: string;
};

type Supabase = Awaited<ReturnType<typeof getAdminSupabase>>;

function parseLines(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readPackageFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const details = parseLines(formData.get("details"));
  const is_published = formData.get("is_published") === "on";
  // Keep submitted order, drop duplicates.
  const serviceIds = [...new Set(formData.getAll("service_ids").map(String).filter(Boolean))];

  if (!title || !price) return { error: "Please fill in the package title and price." } as const;
  if (serviceIds.length < 2) return { error: "A package needs at least 2 services." } as const;

  const payload: Omit<PackageRow, "id" | "created_at" | "updated_at" | "sort_order"> = {
    title,
    slug: slugify(slugInput || title),
    description,
    price,
    duration,
    image_url,
    details,
    is_published,
  };
  return { payload, serviceIds } as const;
}

/** Replaces the services of a package, keeping their order. */
async function saveServices(supabase: Supabase, packageId: string, serviceIds: string[]) {
  const del = await supabase.from("package_services").delete().eq("package_id", packageId);
  if (del.error) return del.error;
  const { error } = await supabase
    .from("package_services")
    .insert(serviceIds.map((service_id, position) => ({ package_id: packageId, service_id, position })));
  return error;
}

export async function createPackage(_prev: PackageActionState, formData: FormData): Promise<PackageActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readPackageFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("packages").insert(parsed.payload).select("id").single();
    if (error || !data) {
      logAdminError("createPackage", error);
      return { error: saveErrorMessage(error) };
    }

    const linkError = await saveServices(supabase, data.id, parsed.serviceIds);
    if (linkError) {
      logAdminError("createPackage.services", linkError);
      await supabase.from("packages").delete().eq("id", data.id); // don't leave a half-saved package
      return { error: saveErrorMessage(linkError) };
    }
  } catch (error) {
    logAdminError("createPackage", error);
    return { error: saveErrorMessage(error) };
  }

  revalidatePath("/packages");
  redirect("/packages");
}

export async function updatePackage(
  id: string,
  _prev: PackageActionState,
  formData: FormData,
): Promise<PackageActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readPackageFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { data: before } = await supabase.from("packages").select("image_url").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("packages")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      logAdminError("updatePackage", error);
      return { error: saveErrorMessage(error) };
    }

    const linkError = await saveServices(supabase, id, parsed.serviceIds);
    if (linkError) {
      logAdminError("updatePackage.services", linkError);
      return { error: saveErrorMessage(linkError) };
    }

    if (before?.image_url && before.image_url !== parsed.payload.image_url) {
      await removeMediaByUrl(supabase, before.image_url);
    }
  } catch (error) {
    logAdminError("updatePackage", error);
    return { error: saveErrorMessage(error) };
  }

  revalidatePath("/packages");
  revalidatePath(`/packages/${id}/edit`);
  redirect("/packages");
}

export async function deletePackage(id: string): Promise<PackageActionState> {
  return bulkDeletePackages([id]);
}

/** Deletes packages (their service links cascade) and their uploaded images. */
export async function bulkDeletePackages(ids: string[]): Promise<PackageActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.length === 0) return { error: MSG.deleteFailed };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("packages").delete().in("id", ids).select("image_url");
    if (error || !data?.length) {
      if (error) logAdminError("deletePackages", error);
      return { error: MSG.deleteFailed };
    }
    await Promise.all(data.map((row) => removeMediaByUrl(supabase, row.image_url)));
  } catch (error) {
    logAdminError("deletePackages", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/packages");
  return { success: "Deleted." };
}

/** Saves a new manual order (drag & drop). */
export async function reorderPackages(ids: string[]): Promise<PackageActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) return { error: MSG.saveFailed };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.rpc("set_sort_order", { p_table: "packages", p_ids: ids });
    if (error) {
      logAdminError("reorderPackages", error);
      return { error: "We couldn't save the new order. Please try again." };
    }
  } catch (error) {
    logAdminError("reorderPackages", error);
    return { error: "We couldn't save the new order. Please try again." };
  }

  revalidatePath("/packages");
  return { success: "Order saved." };
}
