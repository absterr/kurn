import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/v1/auth.v1.module";
import { EnvModule } from "./config/env/env.module";
import { WorkerModule } from "./config/worker.module";
import { JobsV1Module } from "./jobs/v1/jobs.v1.module";
import { LeadsV1Module } from "./leads/v1/leads.v1.module";
import { CleanupModule } from "./lib/cleanup/cleanup.module";

@Module({
  imports: [
    AuthModule,
    CleanupModule,
    EnvModule,
    JobsV1Module,
    LeadsV1Module,
    WorkerModule,
  ],
})
export class AppModule {}
