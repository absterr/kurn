import app from "./app";
import env from "./config/env";

const PORT = env.API_PORT;

Bun.serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Server is running on port ${PORT}`);
