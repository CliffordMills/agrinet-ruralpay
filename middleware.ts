import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROLE_ROUTES: Record<string, string[]> = {
  "/farmer": ["FARMER", "AGENT", "ADMIN", "SUPER_ADMIN"],
  "/agent": ["AGENT", "ADMIN", "SUPER_ADMIN"],
  "/hub": ["HUB_MANAGER", "ADMIN", "SUPER_ADMIN"],
  "/marketplace": ["BUYER", "ADMIN", "SUPER_ADMIN"],
  "/finance": ["ADMIN", "SUPER_ADMIN"],
  "/climate": ["AGENT", "FARMER", "ADMIN", "SUPER_ADMIN"],
  "/admin": ["ADMIN", "ANALYST", "SUPER_ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify");

  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/how-it-works") ||
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/impact") ||
    pathname.startsWith("/partners") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/book-demo") ||
    pathname.startsWith("/trace") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/payments/webhook");

  if (isPublicRoute) return supabaseResponse;

  if (isAuthRoute) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return supabaseResponse;
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const protectedPrefix = Object.keys(ROLE_ROUTES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (protectedPrefix) {
    const allowedRoles = ROLE_ROUTES[protectedPrefix];
    // Prefer app_metadata (set by edge function) over user_metadata for security
    const userRole =
      (user.app_metadata?.role as string) ||
      (user.user_metadata?.role as string) ||
      "FARMER";

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
