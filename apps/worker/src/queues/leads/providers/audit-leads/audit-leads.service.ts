import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { Lead } from "@/utils/shared-types";
import { WebsiteAuditService } from "./website-audit.service";

@Injectable()
export class AuditLeadsService {
  constructor(private readonly websiteAuditService: WebsiteAuditService) {}

  async auditLeads(mapsLeads: Lead[]) {
    const limit = pLimit(2);

    const auditedLeads = await Promise.all(
      mapsLeads.map((lead) =>
        limit(async () => {
          let websiteReachable: boolean | null = null;

          if (lead.website === null) {
            return {
              ...lead,
              websiteReachable,
            };
          }

          try {
            const res = await fetch(lead.website);
            if (!res.ok) throw new Error("Website not reachable");

            websiteReachable = true;
            const websiteAudits = this.websiteAuditService.audit(lead.website);

            return {
              ...lead,
              websiteReachable,
              websiteAudits,
            };
          } catch {
            websiteReachable = false;

            return {
              ...lead,
              websiteReachable,
            };
          }
        }),
      ),
    );

    return auditedLeads;
  }
}
