import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  type AuthVariables,
  authMiddleware,
  roleMiddleware,
} from "@/lib/middleware.js";
import { getDashboardDetails } from "./dashboard.v1.handlers.js";

export const dashboardV1Router = new Hono<AuthVariables>();
dashboardV1Router.use("*", authMiddleware, roleMiddleware("member"));

dashboardV1Router.get("/", async (ctx) => {
  try {
    const memberId = ctx.get("userId");
    return ctx.json(await getDashboardDetails(memberId), 200);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    return ctx.json({ error: "Something went wrong" }, 500);
  }
});
