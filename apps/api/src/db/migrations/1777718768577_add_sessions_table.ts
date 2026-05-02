import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("sessions")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .addColumn("user_agent", "varchar(255)")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .execute();

  await sql`
      CREATE TRIGGER update_sessions_modtime
      BEFORE UPDATE ON sessions
      FOR EACH ROW
      EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("sessions").execute();
}
