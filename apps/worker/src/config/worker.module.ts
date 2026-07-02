import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import Redis from "ioredis";
import { EnvModule } from "./env/env.module";
import { EnvProvider } from "./env/env.provider";

@Module({
  imports: [
    EnvModule,
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvProvider],
      useFactory: (env: EnvProvider) => ({
        connection: new Redis(env.get("REDIS_URL"), {
          maxRetriesPerRequest: null,
        }),
      }),
    }),
  ],
})
export class WorkerModule {}
