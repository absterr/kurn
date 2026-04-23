import { Kysely, sql } from "kysely";

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
// I replaced `any` with `unknown` so Biome won't crashout lol

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createType("interval_type")
    .asEnum(["6h", "12h", "24h"])
    .execute();

  await db.schema
    .createTable("jobs")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("position", "text", (col) => col.notNull())
    .addColumn("timeframe", "text", (col) => col.notNull())
    .addColumn("interval", sql`interval_type`, (col) => col.notNull())
    .addColumn("start_at", "text", (col) => col.notNull())
    .addColumn("work_type", sql`text[]`, (col) =>
      col.defaultTo(sql`'{}'`).notNull(),
    )
    .addColumn("level", sql`text[]`, (col) =>
      col.defaultTo(sql`'{}'`).notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END
      $$ language 'plpgsql';
    `.execute(db);

  await sql`
      CREATE TRIGGER update_jobs_modtime
      BEFORE UPDATE ON jobs
      FOR EACH ROW
      EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("jobs").execute();
  await db.schema.dropType("interval_type").execute();
  await sql`DROP FUNCTION IF EXISTS update_modified_column CASCADE`.execute(db);
}
