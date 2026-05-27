import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("accounts")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .addColumn("account_id", "varchar(255)")
    .addColumn("provider_id", "varchar(255)", (col) => col.notNull())
    .addColumn("password", "varchar(255)")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint("accounts_provider_id_account_id_unique", [
      "provider_id",
      "account_id",
    ])
    .execute();

  await sql`
      CREATE TRIGGER update_accounts_modtime
      BEFORE UPDATE ON accounts
      FOR EACH ROW
      EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("accounts").execute();
}
