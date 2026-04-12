import { Module } from "@nestjs/common";
import { SharedModule } from "src/lib/shared.module";
import { LeadsV1Controller } from "./leads.v1.controller";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsV1Service } from "./providers/leads.v1.service";
import { LinkedinLeadsScraper } from "./providers/linkedin-leads.scraper";

@Module({
  imports: [SharedModule],
  providers: [GoogleMapsScraper, LeadsV1Service, LinkedinLeadsScraper],
  controllers: [LeadsV1Controller],
  exports: [LeadsV1Service],
})
export class LeadsV1Module {}
