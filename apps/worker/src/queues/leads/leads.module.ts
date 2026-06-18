import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env/env.module";
import { DatabaseModule } from "@/db/db.module";
import { SharedModule } from "@/lib/shared/shared.module";
import { LeadsService } from "./leads.service";
import { LeadAuditProcessor } from "./processors/lead-audit.processor";
import { LeadEnrichmentProcessor } from "./processors/lead-enrichment.processor";
import { LeadSearchProcessor } from "./processors/lead-search.processor";
import { AuditLeadsModule } from "./providers/audit-leads";
import { EnrichLeadsService } from "./providers/enrich-leads";
import { GoogleMapsScraper } from "./providers/google-maps.scraper";

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
        name: "lead-enrichment",
      },
    ),
    DatabaseModule,
    EnvModule,
    SharedModule,
    AuditLeadsModule,
  ],
  providers: [
    LeadsService,
    EnrichLeadsService,
    GoogleMapsScraper,
    LeadAuditProcessor,
    LeadSearchProcessor,
    LeadEnrichmentProcessor,
  ],
  exports: [LeadsService],
})
export class LeadsModule {}
