import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { credentialLoginHandler } from "./auth.v1.handlers";
import { loginSchema } from "./auth.v1.schema";

export const authV1Router = new Hono();

authV1Router.post("/login", zValidator("json", loginSchema), async (ctx) => {
  try {
    const valid = ctx.req.valid("json");
    const result = await credentialLoginHandler(ctx, valid);
    return ctx.json(result, 201);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "Something went wrong" }, 500);
  }
});
