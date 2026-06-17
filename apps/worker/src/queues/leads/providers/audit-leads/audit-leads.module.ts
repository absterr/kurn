import { Module } from "@nestjs/common";
import { SharedModule } from "@/lib/shared/shared.module";
import { WebCrawler } from "@/lib/shared/web-crawler";
import { AuditLeadsService } from "./audit-leads.service";
import { PerformanceAuditService } from "./performance-audit.service";
import { UiAuditService } from "./ui-audit.service";
import { WebsiteAuditService } from "./website-audit.service";

@Module({
  imports: [SharedModule],
  providers: [
    AuditLeadsService,
    PerformanceAuditService,
    UiAuditService,
    WebCrawler,
    WebsiteAuditService,
  ],
  exports: [AuditLeadsService],
})
export class AuditLeadsModule {}
