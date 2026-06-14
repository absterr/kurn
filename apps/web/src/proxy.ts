import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/request-access",
  "/forgot-password",
  "/reset-password",
] as const;

// const MEMBER_ROUTES = ["/dashboard", "/leads", "/jobs"] as const;

const verifyAccessToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(ACCESS_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
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

  const payload = await verifyAccessToken(accessToken);

  if (!payload) {
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

  if (payload.userId) response.headers.set("x-user-id", String(payload.userId));
  if (payload.accountId)
    response.headers.set("x-account-id", String(payload.accountId));
  if (payload.role) response.headers.set("x-role", String(payload.role));

  return response;
}

export const config = {
  matcher: [
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
