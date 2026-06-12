import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  type AuthVariables,
  authMiddleware,
  roleMiddleware,
} from "@/lib/middleware";
import { zValidate } from "@/utils/z-validate";
import { createLeadsQuery } from "./leads.v1.handlers";
import { leadsQuerySchema } from "./leads.v1.schema";

export const leadsV1Router = new Hono<AuthVariables>();
leadsV1Router.use("*", authMiddleware, roleMiddleware("member"));

leadsV1Router.post("/", zValidate("json", leadsQuerySchema), async (ctx) => {
  try {
    const valid = ctx.req.valid("json");
    const memberId = ctx.get("userId");
    return ctx.json(await createLeadsQuery(valid, memberId), 201);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "Something went wrong" }, 500);
  }
});
