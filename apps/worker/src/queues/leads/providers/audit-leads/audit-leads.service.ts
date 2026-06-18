import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { AuditedLead, WebsiteAuditResult } from "@/utils/audit-types";
import { Lead } from "@/utils/shared-types";
import { WebsiteAuditService } from "./website-audit.service";

@Injectable()
export class AuditLeadsService {
  constructor(private readonly websiteAuditService: WebsiteAuditService) {}

  async auditLeads(mapsLeads: Lead[]) {
    const limit = pLimit(2);

    const auditedLeads: AuditedLead[] = await Promise.all(
      mapsLeads.map((lead) =>
        limit(async () => {
          let websiteReachable: boolean | null = null;
          let websiteAudits: WebsiteAuditResult | null = null;
          let emails: string[] | null = null;

          if (lead.website === null) {
            return {
              ...lead,
              emails,
              websiteReachable,
              websiteAudits,
            };
          }

          try {
            const res = await fetch(lead.website);
            if (!res.ok) throw new Error("Website not reachable");

            websiteReachable = true;
            emails = await this.websiteAuditService.crawlEmails(lead.website);

            if (lead.phone === null && emails.length === 0) {
              return {
                ...lead,
                emails,
                websiteReachable,
                websiteAudits,
              };
            }

            websiteAudits = await this.websiteAuditService.auditWebsite(
              lead.website,
            );
          } catch {
            websiteReachable = false;
          }

          return {
            ...lead,
            emails,
            websiteReachable,
            websiteAudits,
          };
        }),
      ),
    );

    return auditedLeads;
  }
}
