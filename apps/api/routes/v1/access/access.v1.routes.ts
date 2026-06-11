import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  type AuthVariables,
  authMiddleware,
  roleMiddleware,
} from "@/routes/middleware";
import { zValidate } from "@/utils/z-validate";
import {
  inviteSchema,
  reviewRequestSchema,
  revokeInviteSchema,
} from "./access.v1.schema";
import {
  inviteUserHandler,
  reviewRequestHandler,
  revokeInviteHandler,
} from "./handlers";

export const accessV1Router = new Hono<AuthVariables>();
accessV1Router.use("/*", authMiddleware, roleMiddleware("admin"));

accessV1Router.post(
  "/review",
  zValidate("json", reviewRequestSchema),
  async (ctx) => {
    try {
      const valid = ctx.req.valid("json");
      const reviewerId = ctx.get("userId");
      const result = await reviewRequestHandler(valid, reviewerId);
      return ctx.json(result, 201);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "Internal Server Error" }, 500);
    }
  },
);

accessV1Router.post("/invite", zValidate("json", inviteSchema), async (ctx) => {
  try {
    const valid = ctx.req.valid("json");
    const inviterId = ctx.get("userId");
    const result = await inviteUserHandler(valid, inviterId);
    return ctx.json(result, 201);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "Internal Server Error" }, 500);
  }
});

accessV1Router.post(
  "/revoke",
  zValidate("json", revokeInviteSchema),
  async (ctx) => {
    try {
      const valid = ctx.req.valid("json");
      const reviewerId = ctx.get("userId");
      const result = await revokeInviteHandler(valid, reviewerId);
      return ctx.json(result, 200);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "Internal Server Error" }, 500);
    }
  },
);
