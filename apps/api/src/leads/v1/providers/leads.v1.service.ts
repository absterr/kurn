import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { WebCrawler } from "src/lib/shared/web-crawler";
import { GoogleMapsScraper, Lead } from "./google-maps.scraper";

@Injectable()
export class LeadsV1Service {
  constructor(
    private readonly googleMapsScraper: GoogleMapsScraper,
    private readonly webCrawler: WebCrawler,
  ) {}

  async auditLeads(mapsLeads: Lead[]) {
    const limit = pLimit(2);

    const auditedLeads = await Promise.all(
      mapsLeads.map((lead) =>
        limit(async () => {
          const hasWebsite = !!lead.website;
          let websiteIsReachable = false;
          let emails: string[] = [];

          if (!hasWebsite) {
            return {
              ...lead,
              emails,
              audit: { hasWebsite, websiteIsReachable },
            };
          }

          try {
            const res = await fetch(lead.website);
            if (res.ok) {
              websiteIsReachable = true;
              emails = await this.webCrawler.extractEmails(lead.website);
            }
          } catch {}

          return {
            ...lead,
            emails,
            audit: { hasWebsite, websiteIsReachable },
          };
        }),
      ),
    );

    return auditedLeads;
  }

  async findLeads(keyword: string, location: string) {
    const googleMapsLeads = await this.googleMapsScraper.fallbackScrape(
      keyword,
      location,
    );

    if (googleMapsLeads.length === 0) return [];

    return googleMapsLeads;
  }
}
