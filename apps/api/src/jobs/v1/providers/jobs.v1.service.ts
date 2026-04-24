import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import toCron from "src/utils/toCron";
import { JobsV1Dto, Timeframe } from "../jobs.v1.dto";
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
      .insertInto("job_queries")
      .values({
        position: dto.position,
        timeframe: dto.timeframe,
        interval: dto.interval,
        start_at: dto.startAt,
        work_type: dto.workType ?? [],
        level: dto.level ?? [],
      })
      .onConflict((oc) =>
        oc.column("position").doUpdateSet({
          timeframe: dto.timeframe,
          interval: dto.interval,
          start_at: dto.startAt,
          work_type: dto.workType ?? [],
          level: dto.level ?? [],
        }),
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    const cron = toCron(jobQuery.interval, jobQuery.start_at);

    this.cronScheduler.upsertJob(
      jobQuery.id,
      cron,
      async () =>
        await this.jobHandler.findJobs(
          jobQuery.id,
          jobQuery.position,
          jobQuery.timeframe as Timeframe,
        ),
    );

    return jobQuery;
  }
}
