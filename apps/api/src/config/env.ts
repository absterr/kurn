import { config } from "dotenv";
import { z } from "zod";

config({ path: [".env", ".env.local"] });

const envSchema = z.object({
  API_PORT: z.coerce.number().default(8080),
  API_ENV: z.enum(["development", "production"]).default("development"),
  WEB_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  ACCESS_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
  USER_GMAIL: z.email(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REFRESH_TOKEN: z.string(),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});

const env = envSchema.parse(process.env);

for (const [key, value] of Object.entries(env)) {
  process.env[key] = String(value);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default env;
