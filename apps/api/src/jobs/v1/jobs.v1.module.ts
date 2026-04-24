import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "src/db/db.module";
import { JobsV1Controller } from "./jobs.v1.controller";
import { CronScheduler } from "./providers/cron-scheduler";
import { JobsV1Service } from "./providers/jobs.v1.service";

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot()],
  controllers: [JobsV1Controller],
  providers: [JobsV1Service, CronScheduler],
})
export class JobsV1Module {}
