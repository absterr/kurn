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

const defaultJobOptions = {
  removeOnComplete: true,
  removeOnFail: {
    age: 6 * 60 * 60,
    count: 10,
  },
};

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: "lead-search",
        defaultJobOptions,
      },
      {
        name: "lead-audit",
        defaultJobOptions,
      },
      {
        name: "lead-enrichment",
        defaultJobOptions,
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
