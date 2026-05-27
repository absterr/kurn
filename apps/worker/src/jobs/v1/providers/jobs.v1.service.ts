import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import toCron from "@/utils/to-cron";
import { JobsV1Dto } from "../jobs.v1.dto";
import { CronScheduler } from "./cron-scheduler";

@Injectable()
export class JobsV1Service {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly cronScheduler: CronScheduler,
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

    this.cronScheduler.upsertJob(jobQuery.id, cron, () =>
      console.log("Add cron job."),
    );

    return jobQuery;
  }
}
