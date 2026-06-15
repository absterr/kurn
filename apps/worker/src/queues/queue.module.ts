import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "@/db/db.module";
import { LeadsModule } from "./leads/leads.module";
import { QueueService } from "./queue.service";

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, LeadsModule],
  providers: [QueueService],
})
export class QueueModule {}
