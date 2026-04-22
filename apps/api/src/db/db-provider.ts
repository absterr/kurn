import { Global, Inject, Module, OnModuleDestroy } from "@nestjs/common";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./types";

export const KYSELY_DB = "KYSELY_DB";

@Global()
@Module({
  providers: [
    {
      provide: KYSELY_DB,
      useFactory: () => {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          max: 10,
        });

        return new Kysely<DB>({
          dialect: new PostgresDialect({ pool }),
        });
      },
    },
  ],
  exports: [KYSELY_DB],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<DB>) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
