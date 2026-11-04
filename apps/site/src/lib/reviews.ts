import { cacheLife } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase";

export type Review = {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  image: string;
  createdAt: string;
};

/** Published reviews (RLS only exposes is_published rows to visitors). */
export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheLife("minutes");

  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, role, rating, comment, image_url, created_at")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(24);

    if (error || !data) {
      if (error) console.error("[site] reviews load failed", error);
      return [];
    }
    return data.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      rating: r.rating,
      comment: r.comment,
      image: r.image_url,
      createdAt: r.created_at ?? "",
    }));
  } catch (error) {
    console.error("[site] reviews load failed", error);
    return [];
  }
}
