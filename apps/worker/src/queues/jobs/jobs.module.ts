import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "@/db/db.module";
import { SharedModule } from "@/lib/shared/shared.module";
import { CronScheduler } from "./providers/cron-scheduler";
import { JobsService } from "./providers/jobs.service";

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot(), SharedModule],
  providers: [CronScheduler, JobsService],
})
export class JobsModule {}
