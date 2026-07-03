import { z } from "zod";

const apiVars = {
  API_PORT: z.coerce.number().default(8080),
  API_ENV: z.enum(["development", "production"]).default("development"),
  WEB_ORIGIN: z.url(),
};

const jwtSecrets = {
  ACCESS_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
};

const googleSecrets = {
  USER_GMAIL: z.email(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REFRESH_TOKEN: z.string(),
};

const githubSecrets = {
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
};

const upstashRedisSecrets = {
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
};

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  ...apiVars,
  ...googleSecrets,
  ...jwtSecrets,
  ...githubSecrets,
  ...upstashRedisSecrets,
});

export type Env = z.infer<typeof envSchema>;
