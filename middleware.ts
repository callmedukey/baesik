import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { decrypt } from "./actions/session";

// 1. Specify protected and public routes
const protectedRoutes = ["/admin", "/student", "/school"];
const publicRoutes = ["/", "/login", "/signup", "/find-id", "/reset-password"];

const disabled = false;

export default async function middleware(req: NextRequest) {
  if (disabled) {
    return NextResponse.next();
  }
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect
  if (isProtectedRoute && !session?.userId && path !== "/admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (
    isProtectedRoute &&
    session?.userId &&
    req.nextUrl.pathname.startsWith("/admin") &&
    !session.isAdmin
  ) {
    if (session.isStudent) {
      return NextResponse.redirect(new URL("/student", req.nextUrl));
    }

    if (!session.isStudent) {
      return NextResponse.redirect(new URL("/school", req.nextUrl));
    }

    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (
    isProtectedRoute &&
    session?.userId &&
    req.nextUrl.pathname.startsWith("/student") &&
    !session.isStudent
  ) {
    return NextResponse.redirect(new URL("/school", req.nextUrl));
  }
  if (
    isProtectedRoute &&
    session?.userId &&
    req.nextUrl.pathname.startsWith("/school") &&
    session.isStudent
  ) {
    return NextResponse.redirect(new URL("/student", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    req.nextUrl.pathname.startsWith("/")
  ) {
    if (session.isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }
    if (session.isStudent) {
      return NextResponse.redirect(new URL("/student/", req.nextUrl));
    }
    if (session.isStudent === false) {
      return NextResponse.redirect(new URL("/school/", req.nextUrl));
    }
  }

  return NextResponse.next();
}
