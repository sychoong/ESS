import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/util/constants";

export function middleware(request: NextRequest) {
  // Check if the request has a cookie
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (!cookie && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
   if (request.nextUrl.searchParams.get("token") ) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: request.nextUrl.searchParams.get("token") || "",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
