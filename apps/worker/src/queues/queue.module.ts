import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "@/db/db.module";
import { QueueService } from "./queue.service";
import { LeadsV1Module } from "./v1/leads/leads.v1.module";

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, LeadsV1Module],
  providers: [QueueService],
})
export class QueueModule {}
