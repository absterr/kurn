import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { GoogleMapsScraper } from "./google-maps.scraper";
import { LinkedinAuth } from "./linkedin-auth";
import { LinkedinLeadsScraper } from "./linkedin-leads.scraper";
import { WebCrawler } from "./web-crawler";

@Injectable()
export class LeadsV1Service {
  constructor(
    private readonly googleMapsScraper: GoogleMapsScraper,
    private readonly linkedinAuth: LinkedinAuth,
    private readonly linkedinLeadsScraper: LinkedinLeadsScraper,
    private readonly webCrawler: WebCrawler,
  ) {}
  async findLeads(keyword: string, location: string) {
    const limit = pLimit(2);
    const googleMapsLeads = await this.googleMapsScraper.fallbackScrape(
      keyword,
      location,
    );

    if (googleMapsLeads.length === 0) return [];

    await this.linkedinAuth.confirmSession();

    const leads = await Promise.all(
      googleMapsLeads.map((lead) =>
        limit(async () => {
          let linkedinLead = {};
          let emails: string[] = [];

          try {
            linkedinLead = await this.linkedinLeadsScraper.scrape(
              lead.name,
              location,
            );
          } catch (err) {
            console.log(
              `Linkedin - skipping ${lead.name} due to error: ${err.message}`,
            );
          }

          if (lead.website) {
            try {
              emails = await this.webCrawler.extractEmails(lead.website);
            } catch (err) {
              console.log(`Crawl error for ${lead.website}: ${err.message}`);
            }
          }

          return { ...lead, emails, ...linkedinLead };
        }),
      ),
    );

    return leads;
  }
}
