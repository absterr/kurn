import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";
import { makeDB } from "@/db/index.js";
import { clearAuthCookies } from "@/lib/cookies.js";
import type { AccessTokenPayload } from "@/lib/user-token.js";

export const logout = async (ctx: Context) => {
  const accessToken = getCookie(ctx, "accessToken");
  if (!accessToken) {
    throw new HTTPException(401, { message: "Access token not provided" });
  }

  type AccessToken =
    | {
        role: "guest";
      }
    | AccessTokenPayload;

  const payload = jwt.decode(accessToken) as AccessToken | null;

  if (!payload || !payload.role) {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }

  if (payload.role === "admin" || payload.role === "member") {
    await makeDB()
      .updateTable("sessions")
      .where("id", "=", payload.sessionId)
      .set({
        expiresAt: new Date(),
      })
      .execute();
  }

  clearAuthCookies(ctx);
  return { success: true };
};
