import { Module } from "@nestjs/common";
import { BrowserProvider } from "./providers/browser-provider";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsService } from "./providers/leads.service";
import { LinkedinLeadsScraper } from "./providers/linkedin-leads.scraper";
import { ScraperController } from "./scraper.controller";

@Module({
  providers: [
    BrowserProvider,
    GoogleMapsScraper,
    LeadsService,
    LinkedinLeadsScraper,
  ],
  controllers: [ScraperController],
  exports: [LeadsService],
})
export class ScraperModule {}
