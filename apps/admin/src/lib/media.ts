import type { ElakSupabaseClient } from "@elak/db";
import { supabaseUrl } from "@/lib/supabase-env";
import { logAdminError } from "@/lib/messages";

export const MEDIA_BUCKET = "media";

/** Storage path inside the media bucket for one of our public URLs, or null for external URLs. */
export function mediaPathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const prefix = `${supabaseUrl()}/storage/v1/object/public/${MEDIA_BUCKET}/`;
  if (!url.startsWith(prefix)) return null;
  return decodeURIComponent(url.slice(prefix.length).split("?")[0]);
}

/** Best-effort delete of an uploaded image. External URLs are ignored. Never throws. */
export async function removeMediaByUrl(supabase: ElakSupabaseClient, url: string | null | undefined) {
  const path = mediaPathFromUrl(url);
  if (!path) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) logAdminError("media.remove", error);
}
