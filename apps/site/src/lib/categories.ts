import { cacheLife } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase";

export type ServiceCategory = {
  name: string;
  slug: string;
  image: string;
  serviceCount: number;
};

/** Service categories in admin order (with number of services). */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  "use cache";
  cacheLife("minutes");

  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("service_categories")
      .select("name, slug, image_url, services(count)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("[site] categories load failed", error);
      return [];
    }
    return (data as unknown as { name: string; slug: string; image_url: string; services: { count: number }[] }[]).map(
      (c) => ({
        name: c.name,
        slug: c.slug,
        image: c.image_url,
        serviceCount: c.services?.[0]?.count ?? 0,
      }),
    );
  } catch (error) {
    console.error("[site] categories load failed", error);
    return [];
  }
}
