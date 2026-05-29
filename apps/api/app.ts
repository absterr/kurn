process.on("uncaughtException", (err) => {
  console.error(`UNCAUGHT: ${err.message}, ${err.stack}`);
});

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import env from "./config/env";
import routes from "./routes";

const app = new Hono().basePath("/api");
const WEB_ORIGIN = env.WEB_ORIGIN;

const corsOptions = {
  origin: [WEB_ORIGIN],
  method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use("*", cors(corsOptions));
app.use("*", logger());

app.route("/", routes);

app.get("/health", (ctx) => {
  return ctx.json({
    status: "healthy",
  });
});

export default app;
