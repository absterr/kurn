import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { authRateLimit } from "@/lib/rate-limit";
import { zValidate } from "@/utils/z-validate";
import {
  accessRequestSchema,
  loginSchema,
  passwordSchema,
  tokenSchema,
  userDetailsSchema,
} from "./auth.v1.schema";
import {
  accessRequestHandler,
  credentialLoginHandler,
  credentialRegisterHandler,
  forgotPasswordHandler,
  validateRegisterTokenHandler,
} from "./handlers";

const authRateLimiter = createMiddleware(async (ctx, next) => {
  const ip = ctx.req.header("x-forwarded-for") ?? "unknown";
  const path = new URL(ctx.req.url).pathname;

  if (path.endsWith("/register")) {
    await authRateLimit(ip, null);
  } else {
    const body = await ctx.req.json();
    ctx.set("body", body);
    await authRateLimit(ip, body.email?.toLowerCase() ?? null);
  }

  await next();
});

export const authV1Router = new Hono();
authV1Router.use("*", authRateLimiter);

authV1Router.post("/login", zValidate("json", loginSchema), async (ctx) => {
  try {
    const valid = ctx.req.valid("json");
    const userAgent = ctx.req.header("User-Agent");
    const result = await credentialLoginHandler(ctx, valid, userAgent);
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

authV1Router.post(
  "/forgot-password",
  zValidate("json", userDetailsSchema),
  async (ctx) => {
    try {
      const valid = ctx.req.valid("json");
      const result = await forgotPasswordHandler(valid);
      return ctx.json(result, 201);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "Something went wrong" }, 500);
    }
  },
);
