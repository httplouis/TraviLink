import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/admin", "/driver", "/faculty"];
  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p));

  if (needsAuth) {
    const hasSession = req.cookies.get("sb-access-token") || req.cookies.get("sb:token");
    if (!hasSession) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname); // balik dito after login
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|public|static).*)"],
};
