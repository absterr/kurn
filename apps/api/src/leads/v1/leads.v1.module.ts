import { Module } from "@nestjs/common";
import { LeadsV1Controller } from "./leads.v1.controller";
import { BrowserProvider } from "./providers/browser-provider";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsV1Service } from "./providers/leads.v1.service";
import { LinkedinLeadsScraper } from "./providers/linkedin-leads.scraper";

@Module({
  providers: [
    BrowserProvider,
    GoogleMapsScraper,
    LeadsV1Service,
    LinkedinLeadsScraper,
  ],
  controllers: [LeadsV1Controller],
  exports: [LeadsV1Service],
})
export class LeadsV1Module {}
