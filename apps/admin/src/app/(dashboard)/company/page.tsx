import { connection } from "next/server";
import type { CompanySettingsRow } from "@elak/db";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import CompanyDetails from "./company-details";

export const instant = false;

export default async function CompanyPage() {
  await connection();

  let settings: CompanySettingsRow | null = null;
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = await getAdminSupabase();
      const { data, error } = await supabase.from("company_settings").select("*").eq("id", 1).maybeSingle();

      if (error) {
        logAdminError("company.load", error);
        failed = true;
      } else {
        settings = data;
      }
    } catch (error) {
      logAdminError("company.load", error);
      failed = true;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Company details"
        description="Salon name, contact info, WhatsApp, address, and map used across the site."
      />

      {failed ? (
        <ErrorState description={MSG.loadFailed} retryHref="/company" />
      ) : (
        <CompanyDetails settings={settings} />
      )}
    </>
  );
}
