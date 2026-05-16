import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "src/db/db.module";
import { SharedModule } from "src/lib/shared/shared.module";
import { JobsV1Controller } from "./jobs.v1.controller";
import { CronScheduler } from "./providers/cron-scheduler";
import { JobsV1Service } from "./providers/jobs.v1.service";

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot(), SharedModule],
  controllers: [JobsV1Controller],
  providers: [CronScheduler, JobsV1Service],
})
export class JobsV1Module {}
