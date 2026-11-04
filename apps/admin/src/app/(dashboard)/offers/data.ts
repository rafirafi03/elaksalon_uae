import { getAdminSupabase } from "@/lib/supabase";
import { logAdminError } from "@/lib/messages";
import type { PickItem } from "./offer-form";

/** Products and services available to attach to an offer. Returns null on failure. */
export async function loadPickItems(): Promise<{ products: PickItem[]; services: PickItem[] } | null> {
  try {
    const supabase = await getAdminSupabase();
    const [products, services] = await Promise.all([
      supabase.from("products").select("id, name, image_url, price").order("name"),
      supabase.from("services").select("id, title, image_url, price_from").order("title"),
    ]);
    if (products.error || services.error) {
      logAdminError("offers.pickItems", products.error ?? services.error);
      return null;
    }
    return {
      products: (products.data ?? []).map((p) => ({ id: p.id, name: p.name, image_url: p.image_url, price: p.price })),
      services: (services.data ?? []).map((s) => ({
        id: s.id,
        name: s.title,
        image_url: s.image_url,
        price: s.price_from,
      })),
    };
  } catch (error) {
    logAdminError("offers.pickItems", error);
    return null;
  }
}
