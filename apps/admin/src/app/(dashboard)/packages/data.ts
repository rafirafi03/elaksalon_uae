import { getAdminSupabase } from "@/lib/supabase";
import { logAdminError } from "@/lib/messages";
import type { PickItem } from "@/components/admin/PickList";

/** Services that can be added to a package. Returns null on failure. */
export async function loadServiceItems(): Promise<PickItem[] | null> {
  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("id, title, image_url, price_from")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      logAdminError("packages.services", error);
      return null;
    }
    return (data ?? []).map((s) => ({ id: s.id, name: s.title, image_url: s.image_url, price: s.price_from }));
  } catch (error) {
    logAdminError("packages.services", error);
    return null;
  }
}
