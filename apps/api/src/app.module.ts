import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LinkedinController } from "./linkedin/linkedin.controller";
import { LinkedinService } from "./linkedin/linkedin.service";
import { ScraperModule } from "./scraper/scraper.module";

@Module({
  imports: [ScraperModule],
  controllers: [AppController, LinkedinController],
  providers: [AppService, LinkedinService],
})
export class AppModule {}
