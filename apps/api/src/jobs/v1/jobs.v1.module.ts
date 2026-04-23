import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/db.module";
import { JobsV1Controller } from "./jobs.v1.controller";
import { JobsV1Service } from "./jobs.v1.service";

@Module({
  imports: [DatabaseModule],
  controllers: [JobsV1Controller],
  providers: [JobsV1Service],
})
export class JobsV1Module {}
