import { config } from "dotenv";
import { z } from "zod";

config({ path: [".env", ".env.local"] });

const envSchema = z.object({
  API_PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  WEB_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
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
