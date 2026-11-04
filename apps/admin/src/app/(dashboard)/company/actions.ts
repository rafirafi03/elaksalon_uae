"use server";

import { revalidatePath } from "next/cache";
import type { CompanySettingsRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { MSG, logAdminError, saveErrorMessage } from "@/lib/messages";

export type CompanyActionState = {
  error?: string;
  success?: string;
};

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function readFields(formData: FormData): Omit<CompanySettingsRow, "id" | "updated_at" | "google_reviews_url"> {
  return {
    company_name: String(formData.get("company_name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    whatsapp_number: digitsOnly(String(formData.get("whatsapp_number") ?? "")),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    map_embed_url: String(formData.get("map_embed_url") ?? "").trim(),
    map_link_url: String(formData.get("map_link_url") ?? "").trim(),
    opening_hours: String(formData.get("opening_hours") ?? "").trim(),
    social_links: formData
      .getAll("social_links")
      .map((v) => String(v).trim())
      .filter(Boolean)
      .slice(0, 12),
  };
}

export async function saveCompanySettings(
  _prev: CompanyActionState,
  formData: FormData,
): Promise<CompanyActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const payload = readFields(formData);

  const badLink = payload.social_links.find((link) => !isHttpUrl(link));
  if (badLink) return { error: `Invalid social media link: ${badLink}` };

  if (!payload.company_name) {
    return { error: "Please enter the company name." };
  }

  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from("company_settings").upsert({
      id: 1,
      ...payload,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      logAdminError("company.save", error);
      return { error: saveErrorMessage(error) };
    }
  } catch (error) {
    logAdminError("company.save", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/company");
  revalidatePath("/", "layout");
  return { success: "Company details saved." };
}
