import { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import env from "@/config/env.js";
import { makeDB } from "@/db/index.js";
import { clearAuthCookies } from "@/lib/cookies.js";
import { authMiddleware } from "@/lib/middleware.js";
import { type RefreshTokenPayload, verifyUserToken } from "@/lib/user-token.js";

export const logoutV1Router = new Hono();
logoutV1Router.use("/user", authMiddleware);

logoutV1Router.get("/user", async (ctx) => {
  try {
    const refreshToken = getCookie(ctx, "refreshToken");

    if (!refreshToken) {
      throw new HTTPException(401, { message: "No token provided" });
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
    return ctx.json({ message: "Log out successful" }, 200);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "An unexpected error occurred" }, 500);
  }
});

logoutV1Router.get("/guest", async (ctx) => {
  deleteCookie(ctx, "accessToken");
  return ctx.json({ success: true }, 200);
});
