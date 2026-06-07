import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createLeadsQuery } from "./leads.v1.handlers";
import { leadsQuerySchema } from "./leads.v1.schema";

export const leadsV1Router = new Hono();

leadsV1Router.post("/", zValidator("json", leadsQuerySchema), async (ctx) => {
  try {
    const valid = ctx.req.valid("json");
    return ctx.json(await createLeadsQuery(valid), 201);
  } catch {
    return ctx.json({ error: "Something went wrong" }, 500);
  }
});
