import { config } from "dotenv";
import { type Env, envSchema } from "./env-schema.js";

config({ path: [".env", ".env.local"] });

const env = envSchema.parse(process.env);

for (const [key, value] of Object.entries(env)) {
  process.env[key] = String(value);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export default env;
