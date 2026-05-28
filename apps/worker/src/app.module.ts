import { Module } from "@nestjs/common";
import { EnvModule } from "./config/env/env.module";
import { WorkerModule } from "./config/worker.module";
import { CleanupModule } from "./lib/cleanup/cleanup.module";
import { QueueModule } from "./queues/queue.module";

@Module({
  imports: [CleanupModule, EnvModule, QueueModule, WorkerModule],
})
export class AppModule {}
