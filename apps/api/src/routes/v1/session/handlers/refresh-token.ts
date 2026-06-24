import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import env from "@/config/env.js";
import { makeDB } from "@/db/index.js";
import { setAuthCookies } from "@/lib/cookies.js";
import {
  type RefreshTokenPayload,
  signUserToken,
  verifyUserToken,
} from "@/lib/user-token.js";
import { ONE_DAY_MS, oneWeekFromNow } from "@/utils/date.js";

const MAX_SESSION_AGE = 30 * ONE_DAY_MS;

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
    .where("version", "=", payload.version)
    .where("expiresAt", ">", new Date())
    .selectAll()
    .executeTakeFirst();

  if (!validSession) {
    throw new HTTPException(401, { message: "Invalid or expired session" });
  }

  const now = Date.now();
  const sessionAge = now - new Date(validSession.createdAt).getTime();
  const willExpireSoon = validSession.expiresAt.getTime() - now <= ONE_DAY_MS;
  const withinMaxAge = sessionAge < MAX_SESSION_AGE;
  const shouldRotate = willExpireSoon && withinMaxAge;
  const nextVersion = validSession.version + 1;

  await makeDB()
    .updateTable("sessions")
    .set({
      version: nextVersion,
      ...(shouldRotate && { expiresAt: oneWeekFromNow() }),
    })
    .where("id", "=", validSession.id)
    .execute();

  const sessionAccount = await makeDB()
    .selectFrom("accounts")
    .where("id", "=", validSession.accountId)
    .selectAll()
    .executeTakeFirstOrThrow();

  const refreshToken = signUserToken({
    payload: { sessionId: validSession.id, version: validSession.version },
    options: { expiresIn: "7d" },
    secret: env.REFRESH_SECRET,
  });

  const accessToken = signUserToken({
    payload: {
      accountId: sessionAccount.id,
      role: sessionAccount.role,
      sessionId: validSession.id,
      userId: sessionAccount.userId,
    },
    options: { expiresIn: "15m" },
    secret: env.ACCESS_SECRET,
  });

  setAuthCookies({ ctx, accessToken, refreshToken });
  return { success: true };
};
