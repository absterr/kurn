import { Module } from "@nestjs/common";
import { EnvModule } from "./config/env/env.module";
import { WorkerModule } from "./config/worker.module";
import { QueueModule } from "./queues/queue.module";

@Module({
  imports: [EnvModule, QueueModule, WorkerModule],
})
export class AppModule {}
