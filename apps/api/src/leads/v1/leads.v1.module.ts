import { Module } from "@nestjs/common";
import { EnvModule } from "src/config/env/env.module";
import { SharedModule } from "src/lib/shared/shared.module";
import { LeadsV1Controller } from "./leads.v1.controller";
import { AuditLeadsService } from "./providers/audit-leads.service";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsV1Service } from "./providers/leads.v1.service";
import { OutreachDraftService } from "./providers/outreach-draft.service";

@Module({
  imports: [SharedModule, EnvModule],
  providers: [
    AuditLeadsService,
    GoogleMapsScraper,
    LeadsV1Service,
    OutreachDraftService,
  ],
  controllers: [LeadsV1Controller],
})
export class LeadsV1Module {}
