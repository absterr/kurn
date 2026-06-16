import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { authRateLimit } from "@/lib/rate-limit.js";
import { zValidate } from "@/utils/z-validate.js";
import {
  loginSchema,
  passwordSchema,
  requestAccessSchema,
  tokenSchema,
  userDetailsSchema,
} from "./auth.v1.schema.js";
import {
  credentialLoginHandler,
  credentialRegisterHandler,
  forgotPasswordHandler,
  requestAccessHandler,
  resetPasswordHandler,
  validateRegisterTokenHandler,
} from "./handlers/index.js";

const authRateLimiter = createMiddleware(async (ctx, next) => {
  const ip = ctx.req.header("x-forwarded-for") ?? "unknown";
  const path = new URL(ctx.req.url).pathname;
  const noEmailPaths = ["/register", "/reset-password"];

  if (noEmailPaths.some((p) => path.endsWith(p))) {
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
    return ctx.json({ error: "An unexpected error occurred" }, 500);
  }
});

authV1Router.post(
  "/request-access",
  zValidate("json", requestAccessSchema),
  async (ctx) => {
    try {
      const valid = ctx.req.valid("json");
      const result = await requestAccessHandler(valid);
      return ctx.json(result, 201);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "An unexpected error occurred" }, 500);
    }
  },
);

// USES QUERY PARAM
authV1Router.get("/register", zValidate("query", tokenSchema), async (ctx) => {
  try {
    const { token } = ctx.req.valid("query");
    const result = await validateRegisterTokenHandler(token);
    return ctx.json(result, 200);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "An unexpected error occurred" }, 500);
  }
});

// USES QUERY PARAM
authV1Router.post(
  "/register",
  zValidate("query", tokenSchema),
  zValidate("json", passwordSchema),
  async (ctx) => {
    try {
      const { token } = ctx.req.valid("query");
      const { password } = ctx.req.valid("json");
      const result = await credentialRegisterHandler({ token, password });
      return ctx.json(result, 201);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "An unexpected error occurred" }, 500);
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
      return ctx.json({ error: "An unexpected error occurred" }, 500);
    }
  },
);

authV1Router.post(
  "/reset-password",
  zValidate("query", tokenSchema),
  zValidate("json", passwordSchema),
  async (ctx) => {
    try {
      const { token } = ctx.req.valid("query");
      const { password } = ctx.req.valid("json");
      const result = await resetPasswordHandler({ token, password });
      return ctx.json(result, 200);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "An unexpected error occurred" }, 500);
    }
  },
);
