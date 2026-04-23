import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { DB } from "src/db/types";
import { KYSELY_DB } from "../db/db.module";
import { JobsDto } from "./jobs.dto";

@Injectable()
export class JobsService {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<DB>) {}

  async findJobs(dto: JobsDto) {
    return this.db
      .insertInto("jobs")
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
