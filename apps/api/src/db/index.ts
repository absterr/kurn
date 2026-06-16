import { CamelCasePlugin, Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import env from "../config/env.js";
import type { DB } from "./types.js";

let pool: Pool | undefined;
let db: Kysely<DB> | undefined;

export function makeDB() {
  if (!db) {
    try {
      console.info("> initializing database pool");

      pool = new Pool({
        connectionString: env.DATABASE_URL,
        max: 10,
      });
      db = new Kysely<DB>({
        dialect: new PostgresDialect({ pool }),
        plugins: [new CamelCasePlugin()],
      });

      console.info("> database pool initialized");
    } catch (err) {
      console.error("> database pool failed");
      throw err;
    }
  }

  return db;
}

export async function pingDB() {
  try {
    console.info("> testing connection to database");
    await sql`SELECT 1`.execute(makeDB());
    console.info("> database connected");
    return true;
  } catch (err) {
    console.error("> database connection failed");
    console.error(err);
    return false;
  }
}

export async function closeDB() {
  if (!pool || !db) {
    return;
  }

  try {
    console.info("> closing database pool");

    await db.destroy();

    pool = undefined;
    db = undefined;

    console.info("> database pool closed");
  } catch (err) {
    console.error("> error while closing database");
    throw err;
  }
}
