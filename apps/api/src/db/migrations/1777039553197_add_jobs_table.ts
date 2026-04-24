import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("jobs")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("job_query_id", "uuid", (col) =>
      col.notNull().references("job_queries.id").onDelete("cascade"),
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("link", "text", (col) => col.notNull().unique())
    .addColumn("location", "text", (col) => col.notNull())
    .addColumn("date", "text", (col) => col.notNull())
    .addColumn("applicants_count", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("company_name", "text", (col) => col.notNull())
    .addColumn("company_link", "text", (col) => col.notNull())
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
  await sql`DROP FUNCTION IF EXISTS update_modified_column CASCADE`.execute(db);
}
