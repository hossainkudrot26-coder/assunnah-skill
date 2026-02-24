import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const isHub = nextUrl.pathname.startsWith("/hub");
  const isAdmin = nextUrl.pathname.startsWith("/admin");
  const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
  const isApi = nextUrl.pathname.startsWith("/api");

  // Skip API routes
  if (isApi) return NextResponse.next();

  // Hub pages require login
  if (isHub && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Admin pages require admin role
  if (isAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/hub", nextUrl));
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/hub", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/hub/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
