import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { Lead } from "@/queues/leads/leads.schema";
import { WebsiteAuditService } from "./website-audit.service";

@Injectable()
export class AuditLeadsService {
  constructor(private readonly websiteAuditService: WebsiteAuditService) {}

  private hasContact(phone: string | null, emails: string[] | null) {
    const hasEmails = emails && emails.length > 0;
    return phone !== null || hasEmails;
  }

  async auditLeads(mapsLeads: Lead[]) {
    const limit = pLimit(2);

    const auditedLeads = (
      await Promise.all(
        mapsLeads.map((lead) =>
          limit(async () => {
            if (lead.website === null) {
              return this.hasContact(lead.phone, null)
                ? {
                    ...lead,
                    website: null,
                    emails: null,
                    websiteReachable: null,
                    websiteAudits: null,
                  }
                : null;
            }

            try {
              const res = await fetch(lead.website);
              if (!res.ok) throw new Error("Website not reachable");

              const emails = await this.websiteAuditService.crawlEmails(
                lead.website,
              );

              if (!this.hasContact(lead.phone, emails)) return null;

              const websiteAudits = await this.websiteAuditService.auditWebsite(
                lead.website,
              );

              return {
                ...lead,
                website: lead.website,
                emails,
                websiteReachable: true as const,
                websiteAudits,
              };
            } catch {
              return {
                ...lead,
                website: lead.website,
                emails: null,
                websiteReachable: false as const,
                websiteAudits: null,
              };
            }
          }),
        ),
      )
    ).filter((lead) => lead !== null);

    return auditedLeads;
  }
}
