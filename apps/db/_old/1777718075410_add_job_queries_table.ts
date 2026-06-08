import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("job_queries")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("position", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("timeframe_posted", "varchar(255)", (col) => col.notNull())
    .addColumn("cron_interval", "varchar(255)", (col) =>
      col.notNull().check(sql`cron_interval IN ('6h', '12h', '24h')`),
    )
    .addColumn("start_at", "varchar(255)", (col) => col.notNull())
    .addColumn("workplace_type", sql`varchar(255)[]`, (col) =>
      col.defaultTo(sql`'{}'`).notNull(),
    )
    .addColumn("experience_level", sql`varchar(255)[]`, (col) =>
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
      CREATE TRIGGER update_job_queries_modtime
      BEFORE UPDATE ON job_queries
      FOR EACH ROW
      EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("job_queries").execute();
}
