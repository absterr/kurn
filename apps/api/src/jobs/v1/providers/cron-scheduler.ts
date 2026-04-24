import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

@Injectable()
export class CronScheduler {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

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
