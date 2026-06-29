import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { makeDB } from "@/db/index.js";
import { clearAuthCookies } from "@/lib/cookies.js";
import { getPayload, refreshTokenHandler } from "./handlers/index.js";

export const sessionV1Router = new Hono();

sessionV1Router.get("/user", async (ctx) => {
  try {
    const payload = getPayload(ctx);
    if (payload.role === "guest") {
      throw new HTTPException(403, { message: "User is a guest" });
    }

    const userDetails = await makeDB()
      .selectFrom("users")
      .where("users.id", "=", payload.userId)
      .select(["users.email", "users.name"])
      .executeTakeFirstOrThrow();

    return ctx.json({ ...userDetails, role: payload.role }, 200);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "An unexpected error occurred" }, 500);
  }
});

sessionV1Router.get("/logout", async (ctx) => {
  try {
    const payload = getPayload(ctx);
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
    return ctx.json({ success: true }, 200);
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
