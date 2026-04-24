import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

@Injectable()
export class CronScheduler {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // async onModuleInit() {
  //   const jobQueries = await this.db
  //     .selectFrom('job_queries')
  //     .selectAll()
  //     .execute();

  //   if (jobQueries.length > 0) {
  //     for (const query of jobQueries) {
  //       const cron = toCron(query.interval, query.start_at);
  //       this.upsertJob(query.id, cron, () => console.log('Hello world'));
  //     }
  //   }
  // }

  upsertJob(id: string, cronTime: string, callback: () => void) {
    if (this.schedulerRegistry.doesExist("cron", id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }

    const job = new CronJob(cronTime, callback);
    this.schedulerRegistry.addCronJob(id, job);
    job.start();
  }

  removeJob(id: string) {
    if (this.schedulerRegistry.doesExist("cron", id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }
  }
}
