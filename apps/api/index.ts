Bun.serve({
  fetch: () => {
    return new Response("Hello via Bun!");
  },
  port: process.env.PORT || 8080,
});
