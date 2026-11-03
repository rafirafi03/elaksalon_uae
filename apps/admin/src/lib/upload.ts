"use server";

import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type UploadResult = { url?: string; error?: string };

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  if (!isSupabaseConfigured()) {
    return { error: MSG.uploadFailed };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: MSG.uploadChoose };
  }

  if (!ALLOWED.has(file.type)) {
    return { error: MSG.uploadType };
  }

  if (file.size > MAX_BYTES) {
    return { error: MSG.uploadSize };
  }

  const folder = String(formData.get("folder") || "uploads").replace(/[^a-z0-9/_-]/gi, "");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  try {
    const supabase = getAdminSupabase();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      logAdminError("upload", error);
      return { error: MSG.uploadFailed };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (error) {
    logAdminError("upload", error);
    return { error: MSG.uploadFailed };
  }
}
