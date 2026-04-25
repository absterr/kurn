import { Module } from "@nestjs/common";
import { EnvModule } from "./config/env/env.module";
import { JobsV1Module } from "./jobs/v1/jobs.v1.module";
import { LeadsV1Module } from "./leads/v1/leads.v1.module";
import { TestModule } from "./test/test.module";

@Module({
  imports: [EnvModule, LeadsV1Module, TestModule, JobsV1Module],
})
export class AppModule {}
