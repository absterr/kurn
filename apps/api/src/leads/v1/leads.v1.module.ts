import { Module } from "@nestjs/common";
import { LeadsV1Controller } from "./leads.v1.controller";
import { BrowserContextProvider } from "./providers/browser-context-provider";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsV1Service } from "./providers/leads.v1.service";
import { LinkedinAuth } from "./providers/linkedin-auth";
import { LinkedinLeadsScraper } from "./providers/linkedin-leads.scraper";
import { WebCrawler } from "./providers/web-crawler";

@Module({
  providers: [
    BrowserContextProvider,
    GoogleMapsScraper,
    LeadsV1Service,
    LinkedinAuth,
    LinkedinLeadsScraper,
    WebCrawler,
  ],
  controllers: [LeadsV1Controller],
  exports: [LeadsV1Service],
})
export class LeadsV1Module {}
