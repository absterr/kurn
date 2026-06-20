import { decodeJwt } from "jose";
import { type NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/request-access",
  "/forgot-password",
  "/reset-password",
] as const;

// const MEMBER_ROUTES = ["/dashboard", "/leads", "/jobs"] as const;

const decodeAccessToken = (token: string) => {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
};

const isAuthPath = (path: string) => {
  return AUTH_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuthRoute = isAuthPath(pathname);

  if (!accessToken) {
    if (isAuthRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = decodeAccessToken(accessToken);
  const role = payload?.role as string | undefined;

  if (!payload || !role) {
    if (isAuthRoute) {
      return NextResponse.next();
    }

    const refreshUrl = new URL("/api/refresh", request.url);
    refreshUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  if (payload && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-role", String(payload.role));

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/request-access",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/leads",
    "/jobs",
  ],
};
