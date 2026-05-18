import { InjectQueue } from "@nestjs/bullmq";
import { Inject, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { Kysely } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import { LeadsV1Dto } from "../leads.v1.dto";

@Injectable()
export class LeadsV1Service {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    @InjectQueue("lead-search")
    private readonly leadSearchQueue: Queue,
  ) {}

  async findLeads(dto: LeadsV1Dto) {
    const leadQuery = await this.db
      .insertInto("leadQueries")
      .values(dto)
      .returningAll()
      .executeTakeFirstOrThrow();

    await this.leadSearchQueue.add(
      "lead-search",
      {
        leadQueryId: leadQuery.id,
        keyword: dto.keyword,
        location: dto.location,
      },
      {
        attempts: 2,
        backoff: {
          type: "fixed",
          delay: 10000,
        },
      },
    );
  }
}
