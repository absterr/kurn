import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import env from "@/config/env";
import type { UserRole } from "@/db/types";
import { type AccessTokenPayload, verifyUserToken } from "@/lib/user-token";

export type AuthVariables = {
  Variables: AccessTokenPayload;
};

export const authMiddleware = createMiddleware(async (ctx, next) => {
  const accessToken = getCookie(ctx, "accessToken");

  if (!accessToken) {
    throw new HTTPException(401, { message: "No token provided" });
  }

  const { error, payload } = verifyUserToken<AccessTokenPayload>({
    token: accessToken,
    secret: env.ACCESS_SECRET,
  });

  if (!payload) {
    const message =
      error === "jwt expired" ? "Session expired" : "Invalid token";
    throw new HTTPException(401, { message });
  }

  ctx.set("accountId", payload.accountId);
  ctx.set("sessionId", payload.sessionId);
  ctx.set("role", payload.role);
  ctx.set("userId", payload.userId);

  await next();
});

export const roleMiddleware = (...allowedRoles: UserRole[]) =>
  createMiddleware<AuthVariables>(async (ctx, next) => {
    const role = ctx.var.role;

    if (!allowedRoles.includes(role)) {
      throw new HTTPException(403, { message: "Forbidden" });
    }

    await next();
  });
