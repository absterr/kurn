import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("job_queries")
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createIndex("job_queries_user_id_position_unique")
    .on("job_queries")
    .columns(["user_id", "position"])
    .unique()
    .execute();

  await db.schema
    .alterTable("jobs")
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex("job_queries_user_id_position_unique").execute();
  await db.schema.alterTable("job_queries").dropColumn("user_id").execute();
  await db.schema.alterTable("jobs").dropColumn("user_id").execute();
}
