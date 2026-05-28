import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import env from "./config/env";

const app = new Hono().basePath("/api");
const PORT = env.API_PORT;
const WEB_ORIGIN = env.WEB_ORIGIN;

const corsOptions = {
  origin: [WEB_ORIGIN],
  method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use("*", cors(corsOptions));
app.use("*", logger());

app.get("/health", (ctx) => {
  return ctx.json({
    status: "healthy",
  });
});

Bun.serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Server is running on port ${PORT}`);
