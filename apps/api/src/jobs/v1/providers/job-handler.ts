import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import { Timeframe } from "src/jobs/v1/jobs.v1.dto";
import { LinkedinAuth } from "src/lib/providers/linkedin-auth";
import { LinkedinJobsScraper } from "./linkedin-jobs.scraper";

@Injectable()
export class JobHandler {
  constructor(
    private readonly linkedinAuth: LinkedinAuth,
    private readonly linkedinJobsScraper: LinkedinJobsScraper,
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
  ) {}

  async findJobs(queryId: string, position: string, timeframe: Timeframe) {
    await this.linkedinAuth.confirmSession();

    const jobs = await this.linkedinJobsScraper.scrape(position, timeframe);

    if (jobs.length > 0) {
      await this.db
        .insertInto("jobs")
        .values(
          jobs.map((job) => ({
            job_query_id: queryId,
            title: job.title,
            link: job.link,
            location: job.location,
            date: job.date,
            applicants_count: job.applicantsCount,
            description: job.description,
            company_name: job.companyName,
            company_link: job.companyLink,
          })),
        )
        .onConflict((oc) => oc.column("link").doNothing())
        .execute();
    }
  }
}
