import { Module } from "@nestjs/common";
import { EnvModule } from "src/config/env/env.module";
import { SharedModule } from "src/lib/shared/shared.module";
import { LeadsV1Controller } from "./leads.v1.controller";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsV1Service } from "./providers/leads.v1.service";
import { OutreachService } from "./providers/outreach.service";

@Module({
  imports: [SharedModule, EnvModule],
  providers: [GoogleMapsScraper, LeadsV1Service, OutreachService],
  controllers: [LeadsV1Controller],
})
export class LeadsV1Module {}
