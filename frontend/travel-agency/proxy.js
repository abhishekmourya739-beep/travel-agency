import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isProtectedRoute =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/my-bookings") ||
    pathname.startsWith("/profile");

  // 🔒 protect only private routes
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔁 prevent logged-in user from opening login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/checkout/:path*",
    "/my-bookings/:path*",
    "/profile/:path*",
  ],
};
