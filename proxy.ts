import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "./lib/utils";
import { isAdmin } from "./lib/supabase/auth";
import { authRateLimiter, getClientIp } from "./lib/rate-limiter";

/** Paths that don't require authentication */
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/auth",
  "/planos",
  "/sobre",
  "/termos",
  "/termos-de-uso",
  "/contato",
  "/suporte",
  "/faq",
  "/privacidade",
  "/prompts",
  "/prompt",
  "/subscribe",
  "/tutorial",
  "/api/stripe/webhooks",
  "/robots.txt",
  "/sitemap.xml",
];

/** Paths that have strict rate limiting (auth endpoints) */
const RATE_LIMITED_AUTH_PATHS = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/update-password",
  "/api/auth",
  "/auth/confirm",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

function isAuthPath(pathname: string): boolean {
  return RATE_LIMITED_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

export async function proxy(request: NextRequest) {
  // ─── Rate Limiting for Auth Endpoints ───────────────────────────────
  if (isAuthPath(request.nextUrl.pathname) && request.method === "POST") {
    const ip = getClientIp(request);
    const rateLimitKey = `auth:${ip}:${request.nextUrl.pathname}`;

    // Check first, then increment only if allowed
    const result = authRateLimiter.check(rateLimitKey);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: "Muitas tentativas. Tente novamente mais tarde.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfter ?? 900),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    authRateLimiter.increment(rateLimitKey);
  }

  // ─── Authentication / Session Check ─────────────────────────────────
  let supabaseResponse = NextResponse.next({ request });

  if (hasEnvVars) {
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
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

    // Redirect to login if accessing protected path without user
    if (!user && !isPublicPath(request.nextUrl.pathname)) {
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
  }

  // ─── Security Headers (applied to all responses) ────────────────────
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : "";

  const cspDirectives = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://images.unsplash.com${supabaseHost ? ` https://${supabaseHost}` : ""}`,
    `font-src 'self' data:`,
    `connect-src 'self'${supabaseHost ? ` https://${supabaseHost}` : ""} https://api.stripe.com`,
    `frame-src 'self' https://js.stripe.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join("; ");

  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
  supabaseResponse.headers.set("X-Frame-Options", "DENY");
  supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block");
  supabaseResponse.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  supabaseResponse.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  supabaseResponse.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(self)"
  );
  supabaseResponse.headers.set("Content-Security-Policy", cspDirectives);

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
