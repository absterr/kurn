import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import toCron from "src/utils/toCron";
import { JobsV1Dto } from "../jobs.v1.dto";
import { CronScheduler } from "./cron-scheduler";

@Injectable()
export class JobsV1Service {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly cronScheduler: CronScheduler,
  ) {}

  async findJobs(dto: JobsV1Dto) {
    const job_query = await this.db
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

    const cron = toCron(job_query.interval, job_query.start_at);

    this.cronScheduler.upsertJob(job_query.id, cron, () =>
      console.log("Bullseye"),
    );

    return job_query;
  }
}
