"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ServiceRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import { MSG, logAdminError } from "@/lib/messages";

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
  const category = String(formData.get("category") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const price_from = String(formData.get("price_from") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const details = parseLines(formData.get("details"));

  if (!title || !category || !duration || !price_from || !image_url) {
    return { error: "Please fill in title, category, duration, price, and image." } as const;
  }

  const payload: Omit<ServiceRow, "id" | "created_at" | "updated_at"> = {
    title,
    category,
    duration,
    price_from,
    image_url,
    description,
    details,
    slug: slugify(slugInput || title),
  };

  return { payload } as const;
}

export async function createService(
  _prev: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };

  const parsed = readServiceFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("services").insert(parsed.payload);
    if (error) {
      logAdminError("createService", error);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("createService", error);
    return { error: MSG.saveFailed };
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

  const parsed = readServiceFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from("services")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      logAdminError("updateService", error);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("updateService", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/services");
  revalidatePath(`/services/${id}/edit`);
  redirect("/services");
}

export async function deleteService(id: string): Promise<ServiceActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("services").delete().eq("id", id);
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
