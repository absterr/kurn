import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import env from "@/config/env.js";
import { oneDayFromNow } from "@/utils/date.js";

export const guestV1Router = new Hono();

guestV1Router.get("/", async (ctx) => {
  const guestAccessToken = jwt.sign({ role: "guest" }, env.ACCESS_SECRET, {
    expiresIn: "1d",
    audience: ["guest"],
  });

  setCookie(ctx, "accessToken", guestAccessToken, {
    sameSite: "Strict" as const,
    httpOnly: true,
    secure: env.API_ENV === "production",
    expires: oneDayFromNow(),
  });

  return ctx.json({ success: true }, 200);
});
