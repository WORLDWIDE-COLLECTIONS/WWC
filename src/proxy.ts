import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

const LOGIN_PATH = "/admin/login";

function isProtectedPath(pathname: string) {
  if (pathname === LOGIN_PATH) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/**
 * Refreshes the Supabase session cookie on admin traffic and keeps
 * unauthenticated visitors out of the console.
 */
export async function proxy(request: NextRequest) {
  const url = getSupabaseUrl();
  const anonKey = getAnonKey();
  const { pathname, search } = request.nextUrl;

  const response = NextResponse.next({ request: { headers: request.headers } });

  // Without credentials there is no session to validate — pages fall back to
  // their "configure Supabase" states instead of locking the user out.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === LOGIN_PATH) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
