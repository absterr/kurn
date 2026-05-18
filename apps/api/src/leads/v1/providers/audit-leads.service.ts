import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { WebCrawler } from "src/lib/shared/web-crawler";
import { Lead } from "./google-maps.scraper";

@Injectable()
export class AuditLeadsService {
  constructor(private readonly webCrawler: WebCrawler) {}

  async auditLeads(mapsLeads: Lead[]) {
    const limit = pLimit(2);

    const auditedLeads = await Promise.all(
      mapsLeads.map((lead) =>
        limit(async () => {
          const hasWebsite = !!lead.website;
          const diagnosis: string[] = [];
          let emails: string[] = [];
          let websiteIsReachable = false;

          if (!hasWebsite) {
            diagnosis.push("No website", "Weak online presence");

            return {
              ...lead,
              emails,
              audit: {
                hasWebsite,
                websiteIsReachable,
                diagnosis,
              },
            };
          }

          try {
            const res = await fetch(lead.website);
            if (res.ok) {
              diagnosis.push("Website is reachable");
              websiteIsReachable = true;
              emails = await this.webCrawler.extractEmails(lead.website);
            } else {
              diagnosis.push(`Website returned an error (${res.status})`);
            }
          } catch {
            diagnosis.push("Website is unreachable");
          }

          return {
            ...lead,
            emails,
            audit: { hasWebsite, websiteIsReachable, diagnosis },
          };
        }),
      ),
    );

    return auditedLeads;
  }
}
