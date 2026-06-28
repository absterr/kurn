import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { refreshTokenHandler } from "./handlers/index.js";
import { logout } from "./handlers/logout.js";
import { getUserDetails } from "./handlers/user-details.js";

export const sessionV1Router = new Hono();

sessionV1Router.get("/user", async (ctx) => {
  try {
    const result = await getUserDetails(ctx);
    return ctx.json(result, 200);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "An unexpected error occurred" }, 500);
  }
});

sessionV1Router.get("/logout", async (ctx) => {
  try {
    const result = await logout(ctx);
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
