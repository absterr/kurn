import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import toCron from "src/utils/to-cron";
import { JobsV1Dto } from "../jobs.v1.dto";
import { CronScheduler } from "./cron-scheduler";
import { JobHandler } from "./job-handler";

@Injectable()
export class JobsV1Service {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly cronScheduler: CronScheduler,
    private readonly jobHandler: JobHandler,
  ) {}

  async findJobs(dto: JobsV1Dto) {
    const jobQuery = await this.db
      .insertInto("jobQueries")
      .values(dto)
      .onConflict((oc) => {
        const { position, ...rest } = dto;
        return oc.column("position").doUpdateSet(rest);
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const cron = toCron(jobQuery.cronInterval, jobQuery.startAt);

    this.cronScheduler.upsertJob(
      jobQuery.id,
      cron,
      async () => await this.jobHandler.findJobs(jobQuery.id, dto),
    );

    return jobQuery;
  }
}
