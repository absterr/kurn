import { Module } from "@nestjs/common";
import { SharedModule } from "src/lib/shared/shared.module";
import { LeadsV1Controller } from "./leads.v1.controller";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsV1Service } from "./providers/leads.v1.service";

@Module({
  imports: [SharedModule],
  providers: [GoogleMapsScraper, LeadsV1Service],
  controllers: [LeadsV1Controller],
})
export class LeadsV1Module {}
