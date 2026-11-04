import { getAdminSupabase } from "@/lib/supabase";
import { logAdminError } from "@/lib/messages";

export type CategoryOption = { id: string; name: string };

/** Categories for the service form dropdown. Returns null on failure. */
export async function loadCategoryOptions(): Promise<CategoryOption[] | null> {
  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase
      .from("service_categories")
      .select("id, name")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) {
      logAdminError("services.categories", error);
      return null;
    }
    return data ?? [];
  } catch (error) {
    logAdminError("services.categories", error);
    return null;
  }
}
