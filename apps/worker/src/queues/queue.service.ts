import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { LeadsService } from "./leads/leads.service";

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly leadsService: LeadsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async queueLeadQueries(): Promise<void> {
    try {
      const awaitingQueries = await this.db
        .selectFrom("leadQueries")
        .where("status", "in", ["pending", "successful", "failed"])
        .selectAll()
        .execute();

      this.logger.log(`Found ${awaitingQueries.length} awaiting lead queries`);

      if (awaitingQueries.length === 0) return;

      await this.leadsService.queueLeadSearch(awaitingQueries);

      this.logger.log(`Queued ${awaitingQueries.length} awaiting lead queries`);
    } catch (error) {
      this.logger.error("Error while queueing lead queries:", error);
    }
  }
}
