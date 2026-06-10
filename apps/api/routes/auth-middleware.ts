import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import env from "@/config/env";
import { type AccessTokenPayload, verifyUserToken } from "@/utils/user-token";

type AuthVariables = {
  Variables: AccessTokenPayload;
};

export const authMiddleware = createMiddleware<AuthVariables>(
  async (ctx, next) => {
    const token = getCookie(ctx, "accessToken");

    if (!token) {
      throw new HTTPException(401, { message: "No token provided" });
    }

    const { error, payload } = verifyUserToken<AccessTokenPayload>({
      token,
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
  },
);
