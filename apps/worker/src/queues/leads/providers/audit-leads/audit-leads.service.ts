import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { Lead } from "@/utils/shared-types";

@Injectable()
export class AuditLeadsService {
  constructor() {}

  async auditLeads(mapsLeads: Lead[]) {
    const limit = pLimit(2);

    const auditedLeads = await Promise.all(
      mapsLeads.map((lead) =>
        limit(async () => {
          let websiteReachable: boolean | null = null;
          let diagnosis: string[] | null = null;
          let emails: string[] | null = null;

          if (lead.website === null) {
            diagnosis = ["No website", "Weak online presence"];

            return {
              ...lead,
              emails,
              websiteReachable,
              diagnosis,
            };
          }

          try {
            const res = await fetch(lead.website);
            if (res.ok) {
              diagnosis = ["Website is reachable"];
              websiteReachable = true;
              emails = [];
            } else {
              websiteReachable = false;
              diagnosis = [`Website returned an error (${res.status})`];
            }
          } catch {
            websiteReachable = false;
            diagnosis = ["Website is unreachable"];
          }

          return {
            ...lead,
            emails,
            websiteReachable,
            diagnosis,
          };
        }),
      ),
    );

    return auditedLeads;
  }
}
