import { Inject, Module, OnModuleDestroy } from "@nestjs/common";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { EnvModule } from "src/config/env/env.module";
import { EnvProvider } from "src/config/env/env.provider";
import { DB } from "./types";

export const KYSELY_DB = "KYSELY_DB";

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: KYSELY_DB,
      useFactory: (env: EnvProvider) => {
        const pool = new Pool({
          connectionString: env.get("DATABASE_URL"),
          max: 10,
        });

        return new Kysely<DB>({
          dialect: new PostgresDialect({ pool }),
        });
      },
      inject: [EnvProvider],
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
