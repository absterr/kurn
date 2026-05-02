import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Kysely, sql } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<DB>) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async deleteExpiredSessions(): Promise<void> {
    try {
      const deletedRows = await this.db
        .deleteFrom("sessions")
        .where("expiresAt", "<", sql<Date>`now()`)
        .executeTakeFirstOrThrow();

      this.logger.error(`Deleted ${deletedRows.numDeletedRows} sessions`);
    } catch (error) {
      this.logger.error("Error during session cleanup:", error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteResetVerifications(): Promise<void> {
    try {
      const deletedRows = await this.db
        .deleteFrom("verifications")
        .where("verificationType", "in", ["password_reset", "email_change"])
        .where("expiresAt", "<", sql<Date>`now()`)
        .executeTakeFirstOrThrow();

      this.logger.error(`Deleted ${deletedRows.numDeletedRows} verifications`);
    } catch (error) {
      this.logger.error("Error during verification cleanup:", error);
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async deleteEmailVerifications(): Promise<void> {
    try {
      const deletedRows = await this.db
        .deleteFrom("verifications")
        .where("verificationType", "=", "email_verification")
        .where("expiresAt", "<", sql<Date>`now()`)
        .executeTakeFirstOrThrow();

      this.logger.error(`Deleted ${deletedRows.numDeletedRows} verifications`);
    } catch (error) {
      this.logger.error("Error during verification cleanup:", error);
    }
  }
}
