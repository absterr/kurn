import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import env from "@/config/env.js";
import { makeDB } from "@/db/index.js";
import { type AccessTokenPayload, verifyUserToken } from "@/lib/user-token.js";

export const getUserDetails = async (ctx: Context) => {
  const accessToken = getCookie(ctx, "accessToken");
  if (!accessToken) {
    throw new HTTPException(401, { message: "Access token not provided" });
  }

  type AccessToken =
    | {
        role: "guest";
      }
    | AccessTokenPayload;

  const { error, payload } = verifyUserToken<AccessToken>({
    token: accessToken,
    secret: env.ACCESS_SECRET,
  });

  if (!payload) {
    const message =
      error === "jwt expired" ? "Session expired" : "Invalid token";
    throw new HTTPException(401, { message });
  }

  if (payload.role === "guest") {
    throw new HTTPException(403, { message: "User is a guest" });
  }

  const userDetails = await makeDB()
    .selectFrom("users")
    .where("users.id", "=", payload.userId)
    .select(["users.email", "users.name"])
    .executeTakeFirstOrThrow();

  return { ...userDetails, role: payload.role };
};
