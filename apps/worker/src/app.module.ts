import { Module } from "@nestjs/common";
import { EnvModule } from "./config/env/env.module";
import { WorkerModule } from "./config/worker.module";
import { QueueModule } from "./queues/queue.module";
import { WakeController } from "./wake.controller";

@Module({
  imports: [EnvModule, QueueModule, WorkerModule],
  controllers: [WakeController],
})
export class AppModule {}
