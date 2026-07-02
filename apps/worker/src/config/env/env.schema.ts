import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  SERVER_PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.url().refine((val) => /^postgres(ql)?:\/\//.test(val), {
    message: "DATABASE_URL must use the postgres:// or postgresql:// protocol",
  }),

  REDIS_URL: z.url(),

  USER_GMAIL: z.string(),
  GOOGLE_REFRESH_TOKEN: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GEMINI_API_KEY: z.string(),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;
