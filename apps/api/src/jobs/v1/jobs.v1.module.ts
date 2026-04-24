import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "src/db/db.module";
import { SharedModule } from "src/lib/shared.module";
import { JobsV1Controller } from "./jobs.v1.controller";
import { CronScheduler } from "./providers/cron-scheduler";
import { JobHandler } from "./providers/job-handler";
import { JobsV1Service } from "./providers/jobs.v1.service";
import { LinkedinJobsScraper } from "./providers/linkedin-jobs.scraper";

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot(), SharedModule],
  controllers: [JobsV1Controller],
  providers: [CronScheduler, JobHandler, JobsV1Service, LinkedinJobsScraper],
})
export class JobsV1Module {}
