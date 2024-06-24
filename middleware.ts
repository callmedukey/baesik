import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { decrypt } from "./actions/session";

// 1. Specify protected and public routes
const protectedRoutes = ["/admin/dashboard", "/student", "/school"];
const publicRoutes = ["/admin", "/login", "/signup"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (
    isProtectedRoute &&
    session?.userId &&
    req.nextUrl.pathname.startsWith("/admin/") &&
    !session.isAdmin
  ) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/")
  ) {
    if (session.isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }
    if (session.isStudent) {
      return NextResponse.redirect(new URL("/student/dashboard", req.nextUrl));
    }
    if (session.isStudent === false) {
      return NextResponse.redirect(new URL("/school/dashboard", req.nextUrl));
    }

    if (!session && path !== "/admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  return NextResponse.next();
}
