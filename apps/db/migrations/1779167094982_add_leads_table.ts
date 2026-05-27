import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("leads")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("lead_query_id", "uuid", (col) =>
      col.notNull().references("lead_queries.id").onDelete("cascade"),
    )
    .addColumn("completion_status", "varchar(255)", (col) =>
      col
        .notNull()
        .check(
          sql`completion_status IN ('cancelled', 'completed', 'failed', 'partial', 'paused', 'pending', 'processing')`,
        )
        .defaultTo(sql`'pending'`),
    )
    .addColumn("company_name", "varchar(255)", (col) => col.notNull())
    .addColumn("map_link", "varchar(255)", (col) => col.notNull())
    .addColumn("address", "varchar(255)")
    .addColumn("phone", "varchar(255)")
    .addColumn("website", "varchar(255)")
    .addColumn("website_reachable", "boolean")
    .addColumn("emails", sql`varchar(255)[]`)
    .addColumn("audit_diagnosis", sql`varchar(255)[]`)
    .addColumn("email_draft", "jsonb")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
        CREATE TRIGGER update_leads_modtime
        BEFORE UPDATE ON leads
        FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();
      `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("leads").execute();
}
