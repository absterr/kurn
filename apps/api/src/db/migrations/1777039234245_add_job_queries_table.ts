import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  const typeExists = await sql<{
    exists: boolean;
  }>`SELECT EXISTS (SELECT 1 from pg_type WHERE typname = 'interval_type')`.execute(
    db,
  );

  if (!typeExists.rows[0].exists) {
    await db.schema
      .createType("interval_type")
      .asEnum(["6h", "12h", "24h"])
      .execute();
  }

  await db.schema
    .createTable("job_queries")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("position", "text", (col) => col.notNull().unique())
    .addColumn("timeframe_posted", "text", (col) => col.notNull())
    .addColumn("cron_interval", sql`interval_type`, (col) => col.notNull())
    .addColumn("start_at", "text", (col) => col.notNull())
    .addColumn("workplace_type", sql`text[]`, (col) =>
      col.defaultTo(sql`'{}'`).notNull(),
    )
    .addColumn("experience_level", sql`text[]`, (col) =>
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
      CREATE TRIGGER update_job_queries_modtime
      BEFORE UPDATE ON job_queries
      FOR EACH ROW
      EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("job_queries").execute();
  await db.schema.dropType("interval_type").execute();
  await sql`DROP FUNCTION IF EXISTS update_modified_column CASCADE`.execute(db);
}
