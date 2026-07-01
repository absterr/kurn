import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { Selectable } from "kysely";
import { LeadQueries } from "@/db/types";

@Injectable()
export class LeadsService {
  constructor(
    @InjectQueue("lead-search") private readonly leadSearchQueue: Queue,
  ) {}

  async queueLeadSearch(awaitingQueries: Selectable<LeadQueries>[]) {
    const batchSize = 10;

    for (let i = 0; i < awaitingQueries.length; i += batchSize) {
      const batch = awaitingQueries.slice(i, i + batchSize);
      const bulkJobs = batch.map((query) => ({
        name: "lead-search",
        data: {
          leadQueryId: query.id,
          keyword: query.keyword,
          location: query.location,
        },
        opts: {
          attempts: 2,
          backoff: {
            type: "fixed",
            delay: 10000,
          },
        },
      }));

      await this.leadSearchQueue.addBulk(bulkJobs);
    }
  }
}
