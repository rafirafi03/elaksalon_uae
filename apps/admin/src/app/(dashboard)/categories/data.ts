import { getAdminSupabase } from "@/lib/supabase";
import { logAdminError } from "@/lib/messages";
import type { PickItem } from "@/components/admin/PickList";

/** All services for the category form, with their current category as a note. */
export async function loadServicesForCategory(
  categoryId?: string,
): Promise<{ items: PickItem[]; selected: string[] } | null> {
  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("id, title, image_url, price_from, category_id, service_categories(name)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      logAdminError("categories.services", error);
      return null;
    }
    const rows = (data ?? []) as unknown as {
      id: string;
      title: string;
      image_url: string;
      price_from: string;
      category_id: string | null;
      service_categories: { name: string } | null;
    }[];
    return {
      items: rows.map((s) => ({
        id: s.id,
        name: s.title,
        image_url: s.image_url,
        price: s.price_from,
        note:
          categoryId && s.category_id === categoryId
            ? undefined
            : s.service_categories?.name
              ? `in ${s.service_categories.name}`
              : "No category",
      })),
      selected: categoryId ? rows.filter((s) => s.category_id === categoryId).map((s) => s.id) : [],
    };
  } catch (error) {
    logAdminError("categories.services", error);
    return null;
  }
}
