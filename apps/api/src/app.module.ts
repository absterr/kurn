import { Module } from "@nestjs/common";
import { LeadsV1Module } from "./leads/v1/leads.v1.module";
import { TestModule } from "./test/test.module";

@Module({
  imports: [LeadsV1Module, TestModule],
})
export class AppModule {}
