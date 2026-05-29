import app from "./app";
import env from "./config/env";
import { closeDB } from "./db";

const PORT = env.API_PORT;

// Bun.serve is not supported in some serverless environments
const server = Bun.serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`API server is running on port ${PORT}`);

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.info("> attempting graceful shutdown");
  server.stop();
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
