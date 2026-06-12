import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { HTTPException } from "hono/http-exception";
import env from "@/config/env";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const limiters = {
  ip: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "15m"),
    prefix: "rl:ip",
  }),
  user: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1h"),
    prefix: "rl:user",
  }),
  combo: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "5m"),
    prefix: "rl:combo",
  }),
};

export const authRateLimit = async (ip: string, user: string | null) => {
  const checks = [limiters.ip.limit(ip)];

  if (user) {
    checks.push(
      limiters.user.limit(user),
      limiters.combo.limit(`${ip}:${user}`),
    );
  }

  const results = await Promise.all(checks);
  const blocked = results.find((r) => !r.success);

  if (blocked) {
    throw new HTTPException(429, {
      res: new Response(
        JSON.stringify({ error: "Too many attempts. Try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(
              Math.ceil((blocked.reset - Date.now()) / 1000),
            ),
          },
        },
      ),
    });
  }
};
