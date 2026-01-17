// /proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard"];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Allow public routes
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Read auth cookie
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT
  const payload = await verifyToken(token);

  if (!payload) {
    const response = NextResponse.redirect(
      new URL("/login", req.url)
    );
    response.cookies.delete("auth_token");
    return response;
  }

  // Token valid → allow request
  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Protect only app routes, not assets or APIs
     */
    "/dashboard/:path*",
  ],
};
