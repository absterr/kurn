import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  type AuthVariables,
  authMiddleware,
  roleMiddleware,
} from "@/routes/middleware";
import { zValidate } from "@/utils/z-validate";
import { reviewRequestSchema } from "./access.v1.schema";
import { reviewRequestHandler } from "./handlers/review-request";

export const accessV1Router = new Hono<AuthVariables>();
accessV1Router.use("/*", authMiddleware, roleMiddleware("admin"));

accessV1Router.post(
  "/review",
  zValidate("json", reviewRequestSchema),
  async (ctx) => {
    try {
      const valid = ctx.req.valid("json");
      const result = await reviewRequestHandler(valid);
      return ctx.json(result, 201);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      return ctx.json({ error: "Internal Server Error" }, 500);
    }
  },
);
