import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { BrowserProvider } from "./browser-provider";
import { GoogleMapsScraper } from "./google-maps.scraper";
import { LinkedinLeadsScraper } from "./linkedin-leads.scraper";
import { WebCrawler } from "./web-crawler";

@Injectable()
export class LeadsV1Service {
  constructor(
    private readonly browserProvider: BrowserProvider,
    private readonly googleMapsScraper: GoogleMapsScraper,
    private readonly linkedinLeadsScraper: LinkedinLeadsScraper,
    private readonly webCrawler: WebCrawler,
  ) {}
  async findLeads(keyword: string, location: string) {
    const limit = pLimit(2);
    const scraperBrowser = this.browserProvider.getBrowser();
    const googleMapsLeads = await this.googleMapsScraper.fallbackScrape(
      scraperBrowser,
      keyword,
      location,
    );

    const leads = await Promise.all(
      googleMapsLeads.map((lead) =>
        limit(async () => {
          let linkedinLead = {};
          let emails: string[] = [];

          try {
            linkedinLead = await this.linkedinLeadsScraper.scrape(
              scraperBrowser,
              lead.name,
              location,
            );
          } catch (err) {
            console.log(
              `Linkedin - skipping ${lead.name} due to error: ${err.message}`,
            );
          }

          try {
            if (lead.website) {
              emails = await this.webCrawler.extractEmails(lead.website);
            }
          } catch (err) {
            console.log(`Crawl error for ${lead.website}: ${err.message}`);
          }

          return { ...lead, ...linkedinLead, emails };
        }),
      ),
    );

    return leads;
  }
}
