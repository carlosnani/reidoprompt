import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { isAdmin } from "./auth";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const isPublicPath =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/planos") ||
    request.nextUrl.pathname.startsWith("/sobre") ||
    request.nextUrl.pathname.startsWith("/termos") ||
    request.nextUrl.pathname.startsWith("/contato") ||
    request.nextUrl.pathname.startsWith("/suporte") ||
    request.nextUrl.pathname.startsWith("/faq") ||
    request.nextUrl.pathname.startsWith("/privacidade") ||
    request.nextUrl.pathname.startsWith("/prompts");

  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  // Redirect to login if accessing protected path without user
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Strictly enforce admin role for /admin paths
  if (isAdminPath && !isAdmin(user)) {
    const url = request.nextUrl.clone();
    url.pathname = user ? "/conta" : "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
