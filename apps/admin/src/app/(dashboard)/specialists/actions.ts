"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SpecialistRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import { MSG, logAdminError } from "@/lib/messages";

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

  if (!name || !role || !specialty || !experience || !image_url) {
    return { error: "Please fill in name, role, specialty, experience, and image." } as const;
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

  const parsed = readSpecialistFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("specialists").insert(parsed.payload);
    if (error) {
      logAdminError("createSpecialist", error);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("createSpecialist", error);
    return { error: MSG.saveFailed };
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

  const parsed = readSpecialistFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from("specialists")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      logAdminError("updateSpecialist", error);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("updateSpecialist", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/specialists");
  revalidatePath(`/specialists/${id}/edit`);
  redirect("/specialists");
}

export async function deleteSpecialist(id: string): Promise<SpecialistActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("specialists").delete().eq("id", id);
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
