import { Module } from "@nestjs/common";
import { EnvModule } from "./config/env/env.module";
import { JobsModule } from "./jobs/jobs.module";
import { LeadsV1Module } from "./leads/v1/leads.v1.module";
import { TestModule } from "./test/test.module";

@Module({
  imports: [EnvModule, LeadsV1Module, TestModule, JobsModule],
})
export class AppModule {}
