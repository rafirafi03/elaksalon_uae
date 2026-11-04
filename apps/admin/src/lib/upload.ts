"use server";

import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";
import { MEDIA_BUCKET, removeMediaByUrl } from "@/lib/media";
import { MSG, logAdminError } from "@/lib/messages";
import { compressImage } from "@/lib/image-compress";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type UploadResult = { url?: string; error?: string };

/** Uploads an image to the "media" bucket as the signed-in admin (storage RLS enforced). */
export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  if (!isSupabaseConfigured()) return { error: MSG.uploadFailed };
  const auth = await assertAdmin();
  if (auth.error) return { error: auth.error };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: MSG.uploadChoose };
  if (!ALLOWED[file.type]) return { error: MSG.uploadType };
  if (file.size > MAX_BYTES) return { error: MSG.uploadSize };

  const folder = String(formData.get("folder") || "uploads").replace(/[^a-z0-9_-]/gi, "") || "uploads";

  try {
    // Resize + convert to WebP before storing (keeps pages fast).
    const image = await compressImage(await file.arrayBuffer(), file.type);
    const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${image.ext}`;
    const supabase = await getAdminSupabase();
    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, image.buffer, { contentType: image.contentType, upsert: false });

    if (error) {
      logAdminError("upload", error);
      return { error: MSG.uploadFailed };
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (error) {
    logAdminError("upload", error);
    return { error: MSG.uploadFailed };
  }
}

/** Deletes an image uploaded in the current form session that was replaced/removed before saving. */
export async function deleteUploadedMedia(url: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  if ((await assertAdmin()).error) return;
  try {
    await removeMediaByUrl(await getAdminSupabase(), url);
  } catch (error) {
    logAdminError("upload.delete", error);
  }
}
