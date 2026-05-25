import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { EnvModule } from "src/config/env/env.module";
import { DatabaseModule } from "src/db/db.module";
import { SharedModule } from "src/lib/shared/shared.module";
import { LeadsV1Controller } from "./leads.v1.controller";
import { LeadAuditProcessor } from "./processors/lead-audit.processor";
import { LeadSearchProcessor } from "./processors/lead-search.processor";
import { OutreachDraftProcessor } from "./processors/outreach-draft.processor";
import { AuditLeadsService } from "./providers/audit-leads.service";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
import { LeadsV1Service } from "./providers/leads.v1.service";
import { OutreachDraftService } from "./providers/outreach-draft.service";

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: "lead-search",
      },
      {
        name: "lead-audit",
      },
      {
        name: "outreach-draft",
      },
    ),
    DatabaseModule,
    EnvModule,
    SharedModule,
  ],
  providers: [
    LeadsV1Service,
    LeadAuditProcessor,
    LeadSearchProcessor,
    OutreachDraftProcessor,
    AuditLeadsService,
    GoogleMapsScraper,
    OutreachDraftService,
  ],
  controllers: [LeadsV1Controller],
})
export class LeadsV1Module {}
