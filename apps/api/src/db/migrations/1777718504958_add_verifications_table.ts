import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("verifications")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .addColumn("verification_type", sql`TEXT`, (col) =>
      col
        .notNull()
        .check(
          sql`verification_type IN ('email_change', 'email_verification', 'password_reset')`,
        ),
    )
    .addColumn("value", "text", (col) => col.unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .execute();

  await sql`
      CREATE TRIGGER update_verifications_modtime
      BEFORE UPDATE ON verifications
      FOR EACH ROW
      EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("verifications").execute();
}
