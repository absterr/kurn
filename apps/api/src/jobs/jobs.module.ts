import { Module } from "@nestjs/common";
import { SharedModule } from "src/lib/shared.module";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./providers/jobs.service";
import { LinkedinJobsScraper } from "./providers/linkedin-jobs.scraper";

@Module({
  imports: [SharedModule],
  controllers: [JobsController],
  providers: [JobsService, LinkedinJobsScraper],
})
export class JobsModule {}
