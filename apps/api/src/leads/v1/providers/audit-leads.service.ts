import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { WebCrawler } from "src/lib/shared/web-crawler";
import { Lead } from "./google-maps.scraper";

@Injectable()
export class AuditLeadsService {
  constructor(private readonly webCrawler: WebCrawler) {}

  async auditLeads(mapsLeads: Lead[]) {
    const limit = pLimit(5);

    const auditedLeads = await Promise.all(
      mapsLeads.map((lead) =>
        limit(async () => {
          const diagnosis: string[] = [];
          let emails: string[] = [];
          let websiteReachable: boolean | null = null;

          if (lead.website === null) {
            diagnosis.push("No website", "Weak online presence");

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
              diagnosis.push("Website is reachable");
              websiteReachable = true;
              emails = await this.webCrawler.extractEmails(lead.website);
            } else {
              websiteReachable = false;
              diagnosis.push(`Website returned an error (${res.status})`);
            }
          } catch {
            websiteReachable = false;
            diagnosis.push("Website is unreachable");
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
