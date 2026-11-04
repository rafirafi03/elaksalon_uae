import { logAdminError } from "@/lib/messages";

/**
 * Tells the public site to drop cached data for the given tags (e.g. after an offer changes).
 * Best effort: never throws, gives up after 4s. Needs SITE_URL and REVALIDATE_SECRET in the admin env.
 */
export async function revalidateSite(tags: string[]) {
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");
  const secret = process.env.REVALIDATE_SECRET;
  if (!siteUrl || !secret) {
    logAdminError("revalidateSite", "SITE_URL or REVALIDATE_SECRET not set — site will refresh within its cache time");
    return;
  }
  try {
    const res = await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok) logAdminError("revalidateSite", `HTTP ${res.status}`);
  } catch (error) {
    logAdminError("revalidateSite", error);
  }
}
