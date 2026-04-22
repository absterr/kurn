import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "./env";
import { JobsModule } from "./jobs/jobs.module";
import { LeadsV1Module } from "./leads/v1/leads.v1.module";
import { TestModule } from "./test/test.module";

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    LeadsV1Module,
    TestModule,
    JobsModule,
  ],
})
export class AppModule {}
