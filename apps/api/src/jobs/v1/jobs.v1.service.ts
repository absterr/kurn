import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { DB } from "src/db/types";
import { KYSELY_DB } from "../../db/db.module";
import { JobsV1Dto } from "./jobs.v1.dto";

@Injectable()
export class JobsV1Service {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<DB>) {}

  async findJobs(dto: JobsV1Dto) {
    return this.db
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
  }
}
