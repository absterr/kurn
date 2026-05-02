import { Kysely, sql } from "kysely";

// Run this on your pg database before migrating this file
// CREATE EXTENSION IF NOT EXISTS pg_cron;

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    SELECT cron.schedule(
      'delete_expired_sessions',
      '0 */6 * * *',
      $$ DELETE FROM sessions WHERE expires_at < NOW() $$
    );
  `.execute(db);

  await sql`
    SELECT cron.schedule(
      'delete_expired_verifications',
      '0 * * * *',
      $$ DELETE FROM verifications WHERE expires_at < NOW() $$
    );
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`SELECT cron.unschedule('delete_expired_sessions');`.execute(db);
  await sql`SELECT cron.unschedule('delete_expired_verifications');`.execute(
    db,
  );
}
