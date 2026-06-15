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

  async queueLeadQueries(awaitingQueries: Selectable<LeadQueries>[]) {
    const BATCH_SIZE = 100;

    for (let i = 0; i < awaitingQueries.length; i += BATCH_SIZE) {
      const batch = awaitingQueries.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (query) => {
          await this.leadSearchQueue.add(
            "lead-search",
            {
              leadQueryId: query.id,
              keyword: query.keyword,
              location: query.location,
            },
            {
              attempts: 2,
              backoff: {
                type: "fixed",
                delay: 10000,
              },
            },
          );
        }),
      );
    }
  }
}
