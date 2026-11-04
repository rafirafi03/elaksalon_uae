"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SpecialistRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { removeMediaByUrl } from "@/lib/media";
import { slugify } from "@/lib/slug";
import { MSG, logAdminError, saveErrorMessage } from "@/lib/messages";

export type SpecialistActionState = {
  error?: string;
  success?: string;
};

function parseLines(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readSpecialistFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const specialty = String(formData.get("specialty") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const skills = parseLines(formData.get("skills"));

  if (!name || !role || !specialty || !experience) {
    return { error: "Please fill in name, role, specialty, and experience." } as const;
  }

  const payload: Omit<SpecialistRow, "id" | "created_at" | "updated_at"> = {
    name,
    role,
    specialty,
    experience,
    image_url,
    bio,
    skills,
    slug: slugify(slugInput || name),
  };

  return { payload } as const;
}

export async function createSpecialist(
  _prev: SpecialistActionState,
  formData: FormData,
): Promise<SpecialistActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readSpecialistFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from("specialists").insert(parsed.payload);
    if (error) {
      logAdminError("createSpecialist", error);
      return { error: saveErrorMessage(error) };
    }
  } catch (error) {
    logAdminError("createSpecialist", error);
    return { error: saveErrorMessage(error) };
  }

  revalidatePath("/specialists");
  redirect("/specialists");
}

export async function updateSpecialist(
  id: string,
  _prev: SpecialistActionState,
  formData: FormData,
): Promise<SpecialistActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const parsed = readSpecialistFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = await getAdminSupabase();
    const { data: before } = await supabase.from("specialists").select("image_url").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("specialists")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error && before?.image_url !== parsed.payload.image_url) await removeMediaByUrl(supabase, before?.image_url);

    if (error) {
      logAdminError("updateSpecialist", error);
      return { error: saveErrorMessage(error) };
    }
  } catch (error) {
    logAdminError("updateSpecialist", error);
    return { error: saveErrorMessage(error) };
  }

  revalidatePath("/specialists");
  revalidatePath(`/specialists/${id}/edit`);
  redirect("/specialists");
}

export async function deleteSpecialist(id: string): Promise<SpecialistActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  try {
    const supabase = await getAdminSupabase();
    const { data: deleted, error } = await supabase.from("specialists").delete().eq("id", id).select("image_url");
    if (!error && !deleted?.length) return { error: MSG.deleteFailed };
    if (!error) for (const row of deleted ?? []) await removeMediaByUrl(supabase, row.image_url);
    if (error) {
      logAdminError("deleteSpecialist", error);
      return { error: MSG.deleteFailed };
    }
  } catch (error) {
    logAdminError("deleteSpecialist", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/specialists");
  return { success: "Specialist deleted." };
}

/** Saves a new manual order (drag & drop). Index in `ids` becomes sort_order. */
export async function reorderSpecialists(ids: string[]): Promise<SpecialistActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) return { error: MSG.saveFailed };

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.rpc("set_sort_order", { p_table: "specialists", p_ids: ids });
    if (error) {
      logAdminError("reorderSpecialists", error);
      return { error: "We couldn't save the new order. Please try again." };
    }
  } catch (error) {
    logAdminError("reorderSpecialists", error);
    return { error: "We couldn't save the new order. Please try again." };
  }

  revalidatePath("/specialists");
  return { success: "Order saved." };
}

/** Deletes several specialists at once (and their uploaded images). */
export async function bulkDeleteSpecialists(ids: string[]): Promise<SpecialistActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };
  if (!Array.isArray(ids) || ids.length === 0) return { error: MSG.deleteFailed };

  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.from("specialists").delete().in("id", ids).select("image_url");
    if (error || !data?.length) {
      if (error) logAdminError("bulkDeleteSpecialists", error);
      return { error: MSG.deleteFailed };
    }
    await Promise.all(data.map((row) => removeMediaByUrl(supabase, row.image_url)));
  } catch (error) {
    logAdminError("bulkDeleteSpecialists", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/specialists");
  return { success: "Deleted." };
}
