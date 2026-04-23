import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";

export default defineConfig({
  dialect: "postgres",
  dialectConfig: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    }),
  }),
  migrations: {
    migrationFolder: "src/db/migrations",
  },
});
