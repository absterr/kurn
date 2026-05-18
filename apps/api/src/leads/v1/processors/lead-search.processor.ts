import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { Kysely } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import { GoogleMapsScraper } from "../providers/google-maps.scraper";

interface LeadSearchJobData {
  leadQueryId: string;
  keyword: string;
  location: string;
}

@Processor("lead-search")
export class LeadSearchProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly googleMapsScraper: GoogleMapsScraper,
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

      const results = await this.googleMapsScraper.scrape(keyword, location);

      return results;
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
