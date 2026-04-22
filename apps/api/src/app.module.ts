import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvProvider } from "./config/env/env-provider";
import { validate } from "./config/env/validateEnv";
import { JobsModule } from "./jobs/jobs.module";
import { LeadsV1Module } from "./leads/v1/leads.v1.module";
import { TestModule } from "./test/test.module";

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    LeadsV1Module,
    TestModule,
    JobsModule,
  ],
  providers: [EnvProvider],
})
export class AppModule {}
