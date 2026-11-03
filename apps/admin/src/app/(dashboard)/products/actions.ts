"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductRow } from "@elak/db";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import { MSG, logAdminError } from "@/lib/messages";

export type ProductActionState = {
  error?: string;
  success?: string;
};

function parseDetails(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const details = parseDetails(formData.get("details"));

  if (!name || !brand || !price || !category || !image_url) {
    return { error: "Please fill in name, brand, price, category, and image." } as const;
  }

  const payload: Omit<ProductRow, "id" | "created_at" | "updated_at"> = {
    name,
    brand,
    price,
    category,
    image_url,
    description,
    details,
    slug: slugify(slugInput || name),
  };

  return { payload } as const;
}

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };

  const parsed = readProductFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("products").insert(parsed.payload);
    if (error) {
      logAdminError("createProduct", error);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("createProduct", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.saveFailed };

  const parsed = readProductFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from("products")
      .update({ ...parsed.payload, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      logAdminError("updateProduct", error);
      return { error: MSG.saveFailed };
    }
  } catch (error) {
    logAdminError("updateProduct", error);
    return { error: MSG.saveFailed };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}/edit`);
  redirect("/products");
}

export async function deleteProduct(id: string): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) return { error: MSG.deleteFailed };

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      logAdminError("deleteProduct", error);
      return { error: MSG.deleteFailed };
    }
  } catch (error) {
    logAdminError("deleteProduct", error);
    return { error: MSG.deleteFailed };
  }

  revalidatePath("/products");
  return { success: "Product deleted." };
}
