import { NextRequest, NextResponse } from "next/server";
import { getNewAccessToken } from "./services/auth/auth.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { deleteCookie } from "./lib/cookies";
import { UserRole } from "./types/user";
import { isAuthRoute } from "./lib/auth-utils";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasTokenRefreshedParam =
    request.nextUrl.searchParams.has("tokenRefreshed");

  // If coming back after token refresh, remove the param and continue
  if (hasTokenRefreshedParam) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("tokenRefreshed");
    return NextResponse.redirect(url);
  }

  const tokenRefreshResult = await getNewAccessToken();

  // If token was refreshed, redirect to same page to fetch with new token
  if (tokenRefreshResult?.tokenRefreshed) {
    const url = request.nextUrl.clone();
    url.searchParams.set("tokenRefreshed", "true");
    return NextResponse.redirect(url);
  }

  const accessToken = request.cookies.get("accessToken")?.value || null;
  let userRole: UserRole | null = null;
  if (accessToken) {
    const verifiedToken: JwtPayload | string = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string,
    );

    if (typeof verifiedToken === "string") {
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    userRole = verifiedToken.role;
  }

  const isAuthRouter = isAuthRoute(pathname);

  // user trying to access auth route while loggedin
  if (accessToken && isAuthRouter) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // user trying to access non-auth route while not loggedin
  if (!accessToken && !isAuthRouter) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. API routes   : /api/...
     * 2. Next.js internals: /_next/...
     * 3. Static files: files with a dot (.) like favicon.ico, .png, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
