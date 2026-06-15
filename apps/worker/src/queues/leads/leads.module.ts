import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env/env.module";
import { DatabaseModule } from "@/db/db.module";
import { SharedModule } from "@/lib/shared/shared.module";
import { LeadsService } from "./leads.service";
import { LeadAuditProcessor } from "./processors/lead-audit.processor";
import { LeadSearchProcessor } from "./processors/lead-search.processor";
import { OutreachDraftProcessor } from "./processors/outreach-draft.processor";
import { AuditLeadsService } from "./providers/audit-leads.service";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";
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
    LeadsService,
    AuditLeadsService,
    GoogleMapsScraper,
    OutreachDraftService,
    LeadAuditProcessor,
    LeadSearchProcessor,
    OutreachDraftProcessor,
  ],
  exports: [LeadsService],
})
export class LeadsModule {}
