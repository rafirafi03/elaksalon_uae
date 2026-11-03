import type { CompanySettingsRow } from "@elak/db";
import { createBrowserSupabaseClient } from "@elak/db";

export const defaultCompany: CompanySettingsRow = {
  id: 1,
  company_name: "ELAK",
  tagline: "Premium Men's Salon UAE",
  email: "hello@elaksalon.ae",
  phone: "+971 55 870 5679",
  whatsapp_number: "971558705679",
  address: "Dubai",
  city: "Dubai",
  country: "United Arab Emirates",
  map_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178509074!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff5996b343a1d1f!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae",
  map_link_url: "https://maps.google.com/?q=Dubai+UAE",
  opening_hours: "Open daily · 10:00 AM – 10:00 PM",
};

export async function getCompanySettings(): Promise<CompanySettingsRow> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return defaultCompany;

  try {
    const supabase = createBrowserSupabaseClient(url, anon);
    const { data, error } = await supabase.from("company_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return defaultCompany;
    return { ...defaultCompany, ...data };
  } catch {
    return defaultCompany;
  }
}
