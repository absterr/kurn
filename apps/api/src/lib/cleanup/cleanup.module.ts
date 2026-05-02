import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "src/db/db.module";
import { CleanupService } from "./cleanup.service";

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule],
  providers: [CleanupService],
})
export class CleanupModule {}
