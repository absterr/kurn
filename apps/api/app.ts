import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import env from "./config/env";
import routes from "./routes";
import { refreshTokenHandler } from "./routes/refresh-token";

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

// REFRESH USER TOKEN
app.get("/refresh", async (ctx) => {
  try {
    const result = await refreshTokenHandler(ctx);
    return ctx.json(result);
  } catch (err) {
    if (err instanceof HTTPException) {
      throw err;
    }
    return ctx.json({ error: "Something went wrong" }, 500);
  }
});

app.onError((err, ctx) => {
  if (err instanceof HTTPException) {
    return ctx.json({ error: err.message }, err.status);
  }
  return ctx.json({ error: "Something went wrong" }, 500);
});

export default app;
