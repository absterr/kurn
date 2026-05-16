import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { WebCrawler } from "src/lib/shared/web-crawler";
import { GoogleMapsScraper } from "./google-maps.scraper";

@Injectable()
export class LeadsV1Service {
  constructor(
    private readonly googleMapsScraper: GoogleMapsScraper,
    private readonly webCrawler: WebCrawler,
  ) {}
  async findLeads(keyword: string, location: string) {
    const limit = pLimit(2);
    const googleMapsLeads = await this.googleMapsScraper.fallbackScrape(
      keyword,
      location,
    );

    if (googleMapsLeads.length === 0) return [];

    const leads = await Promise.all(
      googleMapsLeads.map((lead) =>
        limit(async () => {
          let emails: string[] = [];

          if (lead.website) {
            try {
              emails = await this.webCrawler.extractEmails(lead.website);
            } catch (err) {
              console.log(`Crawl error for ${lead.website}: ${err.message}`);
            }
          }

          return { ...lead, emails };
        }),
      ),
    );

    return leads;
  }
}
