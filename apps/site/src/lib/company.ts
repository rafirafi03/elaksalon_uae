import type { CompanySettingsRow } from "@elak/db";
import { cacheLife } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase";
import { defaultCompany } from "@/lib/company-defaults";

export { defaultCompany };


export async function getCompanySettings(): Promise<CompanySettingsRow> {
  "use cache";
  cacheLife("minutes");

  const supabase = getPublicSupabase();
  if (!supabase) return defaultCompany;

  try {
    const { data, error } = await supabase.from("company_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return defaultCompany;
    return { ...defaultCompany, ...data };
  } catch {
    return defaultCompany;
  }
}
