import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("lead_queries")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("keyword", "varchar(255)", (col) => col.notNull())
    .addColumn("location", "varchar(255)")
    .addColumn("status", "varchar(255)", (col) =>
      col
        .notNull()
        .check(
          sql`status IN ('cancelled', 'completed', 'failed', 'partial', 'paused', 'pending', 'processing')`,
        )
        .defaultTo(sql`'pending'`),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
      CREATE TRIGGER update_lead_queries_modtime
      BEFORE UPDATE ON lead_queries
      FOR EACH ROW
      EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("lead_queries").execute();
}
