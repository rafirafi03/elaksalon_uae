import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@elak/db";
import { supabaseKey, supabaseUrl } from "@/lib/supabase-env";

const PUBLIC_PATHS = ["/login", "/forgot-password", "/auth/confirm"];

/**
 * Runs before every admin request:
 * 1. Refreshes the Supabase session and writes updated auth cookies.
 * 2. Redirects anyone who is not a signed-in admin to /login.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = supabaseUrl();
  const key = supabaseKey();
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!url || !key) {
    return isPublic ? response : redirectTo(request, "/login");
  }

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  // Do not run code between createServerClient and getClaims — it refreshes the session.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  let admin = false;
  if (signedIn) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    admin = isAdmin === true;
  }

  if (!admin && !isPublic) {
    const target = redirectTo(request, "/login", pathname !== "/" ? pathname : undefined);
    response.cookies.getAll().forEach((c) => target.cookies.set(c));
    return target;
  }

  if (admin && pathname === "/login") {
    return redirectTo(request, "/");
  }

  return response;
}

function redirectTo(request: NextRequest, path: string, next?: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = next ? `?next=${encodeURIComponent(next)}` : "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
