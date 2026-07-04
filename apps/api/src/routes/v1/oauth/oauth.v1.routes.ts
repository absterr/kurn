import type { HttpBindings } from "@hono/node-server";
import { RESPONSE_ALREADY_SENT } from "@hono/node-server/utils/response";
import { type Context, Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { Selectable } from "kysely";
import passport from "passport";
import z from "zod";
import type { Accounts } from "@/db/types.js";
import { grantUserSession } from "@/lib/grant-session.js";
import { unauthenticatedMiddleware } from "@/lib/middleware.js";
import { authRateLimit } from "@/lib/rate-limit.js";
import { zValidate } from "@/utils/z-validate.js";

const USER_ROLE = ["member", "admin"] as const;
const roleSchema = z.object({
  role: z.enum(USER_ROLE, { error: "Role is required" }),
});

const oauthRateLimiter = createMiddleware(async (ctx, next) => {
  const ip = ctx.req.header("x-forwarded-for") ?? "unknown";
  await authRateLimit(ip, null);
  await next();
});

const authenticateCallback = (ctx: Context, provider: string) =>
  new Promise<Response>((resolve, reject) => {
    passport.authenticate(
      provider,
      async (err: unknown, account: Selectable<Accounts>) => {
        if (err) {
          if (err instanceof HTTPException) {
            return reject(err);
          }
          return reject(new HTTPException(500, { cause: err }));
        }
        if (!account) {
          return reject(
            new HTTPException(401, { message: "Authentication failed" }),
          );
        }

        // We should find a way to get the user agent from the request
        // We should probably also redirect to the frontend URL
        await grantUserSession(ctx, account);
        resolve(ctx.json({ message: "Authentication successful" }));
      },
    )(ctx.env.incoming, ctx.env.outgoing);
  });

type Env = {
  Bindings: HttpBindings;
};

export const oauthV1Router = new Hono<Env>();
oauthV1Router.use("*", unauthenticatedMiddleware, oauthRateLimiter);

oauthV1Router.get("/google", zValidate("query", roleSchema), async (ctx) => {
  const { role } = ctx.req.valid("query");

  passport.authenticate("google", { scope: ["profile", "email"], state: role })(
    ctx.env.incoming,
    ctx.env.outgoing,
  );

  return RESPONSE_ALREADY_SENT;
});

oauthV1Router.get("/callback/google", (ctx) =>
  authenticateCallback(ctx, "google"),
);

oauthV1Router.get("/github", zValidate("query", roleSchema), async (ctx) => {
  const { role } = ctx.req.valid("query");

  passport.authenticate("github", { scope: ["profile", "email"], state: role })(
    ctx.env.incoming,
    ctx.env.outgoing,
  );

  return RESPONSE_ALREADY_SENT;
});

oauthV1Router.get("/callback/github", (ctx) =>
  authenticateCallback(ctx, "github"),
);
