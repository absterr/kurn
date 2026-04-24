import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import { JobsV1Dto } from "src/jobs/v1/jobs.v1.dto";
import { LinkedinAuth } from "src/lib/providers/linkedin-auth";
import { LinkedinJobsScraper } from "./linkedin-jobs.scraper";

@Injectable()
export class JobHandler {
  constructor(
    private readonly linkedinAuth: LinkedinAuth,
    private readonly linkedinJobsScraper: LinkedinJobsScraper,
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
  ) {}

  async findJobs(queryId: string, dto: JobsV1Dto) {
    await this.linkedinAuth.confirmSession();

    const jobs = await this.linkedinJobsScraper.scrape(dto);

    if (jobs.length > 0) {
      await this.db
        .insertInto("jobs")
        .values(
          jobs.map((job) => ({
            job_query_id: queryId,
            ...job,
          })),
        )
        .onConflict((oc) => oc.column("link").doNothing())
        .execute();
    }
  }
}
