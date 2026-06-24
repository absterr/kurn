import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "@/lib/middleware.js";
import { refreshTokenHandler } from "./handlers/index.js";
import { logoutGuest, logoutUser } from "./handlers/logout.js";

export const sessionV1Router = new Hono();
sessionV1Router.use("/logout/user", authMiddleware);

sessionV1Router.get("/logout/user", async (ctx) => {
  try {
    const result = await logoutUser(ctx);
    return ctx.json(result, 200);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "An unexpected error occurred" }, 500);
  }
});

sessionV1Router.get("/logout/guest", async (ctx) => {
  try {
    const result = await logoutGuest(ctx);
    return ctx.json(result, 200);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "An unexpected error occurred" }, 500);
  }
});

sessionV1Router.post("/refresh", async (ctx) => {
  try {
    const result = await refreshTokenHandler(ctx);
    return ctx.json(result, 200);
  } catch (err) {
    if (err instanceof HTTPException) {
      throw err;
    }
    return ctx.json({ error: "An unexpected error occured" }, 500);
  }
});
