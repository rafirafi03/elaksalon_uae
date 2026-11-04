import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

/** Cache tags the admin is allowed to expire. */
const ALLOWED_TAGS = new Set(["offers"]);

function secretMatches(given: string | null) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Called by the admin app after content changes so visitors never see stale data
 * (e.g. an offer's old end time). Protected by a shared secret.
 *
 * POST /api/revalidate  { "tags": ["offers"] }  with header  x-revalidate-secret: <REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let tags: unknown;
  try {
    ({ tags } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const valid = Array.isArray(tags) ? tags.filter((t): t is string => typeof t === "string" && ALLOWED_TAGS.has(t)) : [];
  if (valid.length === 0) return NextResponse.json({ ok: false, error: "No valid tags" }, { status: 400 });

  // Expire immediately: the next visitor gets fresh data, never the stale copy.
  for (const tag of valid) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: valid });
}
