import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("email_verified", "boolean", (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await sql`
      CREATE TRIGGER update_users_modtime
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
