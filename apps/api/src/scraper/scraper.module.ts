import { Module } from "@nestjs/common";
import { BrowserProvider } from "./providers/browser-provider";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsService } from "./providers/leads.service";
import { ScraperController } from "./scraper.controller";

@Module({
  providers: [GoogleMapsScraper, BrowserProvider, LeadsService],
  controllers: [ScraperController],
  exports: [LeadsService],
})
export class ScraperModule {}
