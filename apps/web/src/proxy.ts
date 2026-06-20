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

  const payload = accessToken ? decodeAccessToken(accessToken) : null;
  const role = payload?.role as string | undefined;
  const isAuthenticated = !!payload && !!role;

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();
  if (role) response.headers.set("x-role", role);
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
