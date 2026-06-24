import type { Context } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";
import { successProcessor } from "node_modules/zod/v4/core/json-schema-processors.cjs";
import env from "@/config/env.js";
import { makeDB } from "@/db/index.js";
import { clearAuthCookies } from "@/lib/cookies.js";
import { type RefreshTokenPayload, verifyUserToken } from "@/lib/user-token.js";

export const logoutUser = async (ctx: Context) => {
  const refreshToken = getCookie(ctx, "refreshToken");

  if (!refreshToken) {
    throw new HTTPException(401, { message: "Refresh token not provided" });
  }

  const { payload, error } = verifyUserToken<RefreshTokenPayload>({
    token: refreshToken,
    secret: env.REFRESH_SECRET,
  });

  if (!payload) {
    const message =
      error === "jwt expired" ? "Session expired" : "Invalid token";
    throw new HTTPException(401, { message });
  }

  await makeDB()
    .updateTable("sessions")
    .where("id", "=", payload.sessionId)
    .set({
      expiresAt: new Date(),
    })
    .execute();

  clearAuthCookies(ctx);
  return { success: true };
};

export const logoutGuest = async (ctx: Context) => {
  const accessToken = getCookie(ctx, "accessToken");

  if (!accessToken) {
    throw new HTTPException(401, { message: "Access token not provided" });
  }

  type GuestPayload = { role: "guest" };

  const payload = jwt.verify(accessToken, env.ACCESS_SECRET, {
    audience: ["guest"],
  }) as GuestPayload | undefined;

  if (!payload || !payload.role) {
    throw new HTTPException(401, { message: "Invalid token" });
  }

  if (payload.role !== "guest") {
    throw new HTTPException(403, { message: "Not a guest" });
  }

  deleteCookie(ctx, "accessToken");
  return { success: true };
};
