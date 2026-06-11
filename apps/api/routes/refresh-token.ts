import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import env from "@/config/env";
import { makeDB } from "@/db";
import { refreshAuthCookies } from "@/utils/jwt";
import {
  type RefreshTokenPayload,
  signUserToken,
  verifyUserToken,
} from "@/utils/user-token";

export const refreshTokenHandler = async (ctx: Context) => {
  const token = getCookie(ctx, "refreshToken");

  if (!token) {
    throw new HTTPException(401, { message: "No token provided" });
  }

  const { error, payload } = verifyUserToken<RefreshTokenPayload>({
    token,
    secret: env.REFRESH_SECRET,
  });

  if (!payload) {
    const message =
      error === "jwt expired" ? "Session expired" : "Invalid token";
    throw new HTTPException(401, { message });
  }

  const validSession = await makeDB()
    .selectFrom("sessions")
    .where("id", "=", payload.sessionId)
    .where("expiresAt", ">", new Date())
    .selectAll()
    .executeTakeFirst();

  if (!validSession) {
    throw new HTTPException(401, { message: "Invalid or expired session" });
  }

  const sessionAccount = await makeDB()
    .selectFrom("accounts")
    .where("id", "=", validSession.accountId)
    .selectAll()
    .executeTakeFirstOrThrow();

  const newAccessToken = signUserToken({
    payload: {
      accountId: sessionAccount.id,
      role: sessionAccount.role,
      sessionId: validSession.id,
      userId: sessionAccount.userId,
    },
    options: { expiresIn: "15m" },
    secret: env.ACCESS_SECRET,
  });

  refreshAuthCookies({ ctx, newAccessToken });
  return { message: "Token refreshed" };
};
