import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { GoogleMapsScraper } from "../providers/google-maps.scraper";

interface LeadSearchJobData {
  leadQueryId: string;
  keyword: string;
  location: string | null;
}

@Processor("lead-search")
export class LeadSearchProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly googleMapsScraper: GoogleMapsScraper,
    @InjectQueue("lead-audit") private readonly leadAuditQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<LeadSearchJobData>) {
    const { leadQueryId, keyword, location } = job.data;

    try {
      await this.db
        .updateTable("leadQueries")
        .set({ status: "processing" })
        .where("id", "=", leadQueryId)
        .execute();

      const leads = await this.googleMapsScraper.scrape(keyword, location);

      await this.leadAuditQueue.add(
        "lead-audit",
        {
          leadQueryId,
          leads,
        },
        {
          attempts: 3,
          backoff: {
            type: "fixed",
            delay: 5000,
          },
        },
      );
    } catch (err) {
      const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);

      if (isLastAttempt) {
        await this.db
          .updateTable("leadQueries")
          .set({ status: "failed" })
          .where("id", "=", leadQueryId)
          .execute();
      }

      throw err;
    }
  }
}
