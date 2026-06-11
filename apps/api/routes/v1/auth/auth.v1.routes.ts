import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidate } from "@/utils/z-validate";
import {
  accessRequestSchema,
  loginSchema,
  passwordSchema,
  tokenSchema,
} from "./auth.v1.schema";
import {
  accessRequestHandler,
  credentialLoginHandler,
  credentialRegisterHandler,
  validateRegisterTokenHandler,
} from "./handlers";

export const authV1Router = new Hono();

authV1Router.post("/login", zValidate("json", loginSchema), async (ctx) => {
  try {
    const valid = ctx.req.valid("json");
    const result = await credentialLoginHandler(ctx, valid);
    return ctx.json(result, 201);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "Something went wrong" }, 500);
  }
});

authV1Router.post(
  "/request",
  zValidate("json", accessRequestSchema),
  async (ctx) => {
    try {
      const valid = ctx.req.valid("json");
      const result = await accessRequestHandler(valid);
      return ctx.json(result, 201);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "Something went wrong" }, 500);
    }
  },
);

// USES QUERY PARAM
authV1Router.get("/register", zValidate("query", tokenSchema), async (ctx) => {
  try {
    const valid = ctx.req.valid("query");
    const result = await validateRegisterTokenHandler(valid);
    return ctx.json(result, 200);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "Something went wrong" }, 500);
  }
});

// USES QUERY PARAM
authV1Router.post(
  "/register",
  zValidate("query", tokenSchema),
  zValidate("json", passwordSchema),
  async (ctx) => {
    try {
      const validQueryParam = ctx.req.valid("query");
      const validBody = ctx.req.valid("json");
      const result = await credentialRegisterHandler(
        validQueryParam,
        validBody,
      );
      return ctx.json(result, 201);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "Something went wrong" }, 500);
    }
  },
);
