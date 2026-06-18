import { serve } from "@hono/node-server";
import app from "./app.js";
import env from "./config/env.js";
import { closeDB } from "./db/index.js";

const server = serve(
  {
    fetch: app.fetch,
    port: env.API_PORT,
  },
  (info) => {
    console.log(`API server is running on port ${info.port}`);
  },
);

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.info("> attempting graceful shutdown");
  server.close();
  console.info("> HTTP server terminated");

  try {
    await closeDB();
    console.info("> database connection closed");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
}

// SERVER EVENT LISTENERS

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("unhandledRejection", async (err) => {
  console.error("> unhandled rejection");

  if (err instanceof Error) {
    console.error(err.name, err.message);
  } else {
    console.error(err);
  }

  await shutdown();
  process.exit(1);
});

process.on("uncaughtException", async (err) => {
  console.error("> uncaught exception");
  console.error(err.name, err.message);
  await shutdown();
  process.exit(1);
});
