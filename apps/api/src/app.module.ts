import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LinkedinController } from "./linkedin/linkedin.controller";
import { LinkedinService } from "./linkedin/linkedin.service";
import { ScraperController } from "./scraper/scraper.controller";
import { ScraperService } from "./scraper/scraper.service";

@Module({
  imports: [],
  controllers: [AppController, ScraperController, LinkedinController],
  providers: [AppService, ScraperService, LinkedinService],
})
export class AppModule {}
