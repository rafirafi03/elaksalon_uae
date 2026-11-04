import { unstable_rethrow } from "next/navigation";
import { logAdminError } from "@/lib/messages";

export type LoadResult<T> = { ok: true; value: T } | { ok: false };

/**
 * Runs a data loader, logging failures instead of throwing.
 * Keeps JSX out of try/catch in pages (rendering errors belong to error boundaries),
 * while still letting Next.js control-flow errors (notFound, redirect) through.
 */
export async function safeLoad<T>(scope: string, load: () => Promise<T>): Promise<LoadResult<T>> {
  try {
    return { ok: true, value: await load() };
  } catch (error) {
    unstable_rethrow(error);
    logAdminError(scope, error);
    return { ok: false };
  }
}
