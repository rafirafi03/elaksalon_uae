"use server";

import { revalidatePath } from "next/cache";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { compressImage } from "@/lib/image-compress";
import { MEDIA_BUCKET, mediaPathFromUrl } from "@/lib/media";
import { logAdminError } from "@/lib/messages";

export type OptimizeResult = {
  error?: string;
  checked?: number;
  optimized?: number;
  savedKb?: number;
  failed?: number;
};

/** Images larger than this are re-compressed. */
const THRESHOLD_BYTES = 400 * 1024;

const TABLES = ["service_categories", "services", "products", "specialists", "packages", "reviews"] as const;

/**
 * One-time maintenance: re-compresses large images already in the media bucket (uploaded before
 * automatic compression existed), points the records at the new files and deletes the originals.
 */
export async function optimizeStoredImages(): Promise<OptimizeResult> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not configured." };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const supabase = await getAdminSupabase();
  let checked = 0;
  let optimized = 0;
  let failed = 0;
  let saved = 0;

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select("id, image_url");
    if (error) {
      logAdminError(`optimize.${table}`, error);
      continue; // table may not exist yet (migration not run)
    }

    for (const row of (data ?? []) as { id: string; image_url: string }[]) {
      const oldPath = mediaPathFromUrl(row.image_url);
      if (!oldPath) continue; // external URL or empty
      checked++;

      try {
        const res = await fetch(row.image_url, { cache: "no-store" });
        if (!res.ok) throw new Error(`download ${res.status}`);
        const original = Buffer.from(await res.arrayBuffer());
        if (original.length <= THRESHOLD_BYTES) continue;

        const contentType = res.headers.get("content-type")?.split(";")[0] || "image/jpeg";
        const image = await compressImage(original, contentType);
        if (image.buffer.length >= original.length) continue;

        const folder = oldPath.includes("/") ? oldPath.slice(0, oldPath.lastIndexOf("/")) : "uploads";
        const newPath = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${image.ext}`;
        const up = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(newPath, image.buffer, { contentType: image.contentType, upsert: false });
        if (up.error) throw up.error;

        const newUrl = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(newPath).data.publicUrl;
        const upd = await supabase.from(table).update({ image_url: newUrl }).eq("id", row.id);
        if (upd.error) {
          await supabase.storage.from(MEDIA_BUCKET).remove([newPath]); // roll back the new file
          throw upd.error;
        }

        await supabase.storage.from(MEDIA_BUCKET).remove([oldPath]);
        optimized++;
        saved += original.length - image.buffer.length;
      } catch (error) {
        failed++;
        logAdminError(`optimize.${table}.${row.id}`, error);
      }
    }
  }

  revalidatePath("/", "layout");
  return { checked, optimized, failed, savedKb: Math.round(saved / 1024) };
}
