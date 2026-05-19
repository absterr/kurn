import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { EnvModule } from "./env/env.module";
import { EnvProvider } from "./env/env.provider";

@Module({
  imports: [
    EnvModule,
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvProvider],
      useFactory: (env: EnvProvider) => ({
        connection: {
          host: env.get("REDIS_HOST"),
          port: env.get("REDIS_PORT"),
        },
      }),
    }),

    BullModule.registerQueue(
      {
        name: "lead-search",
      },
      {
        name: "lead-audit",
      },
      {
        name: "outreach-draft",
      },
    ),
  ],
})
export class WorkerModule {}
