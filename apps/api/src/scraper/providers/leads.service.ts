import { Injectable } from "@nestjs/common";
import pLimit from "p-limit";
import { BrowserProvider } from "./browser-provider";
import { GoogleMapsScraper } from "./google-maps.scraper";
import { LinkedinLeadsScraper } from "./linkedin-leads.scraper";

@Injectable()
export class LeadsService {
  constructor(
    private readonly browserProvider: BrowserProvider,
    private readonly googleMapsScraper: GoogleMapsScraper,
    private readonly linkedinLeadsScraper: LinkedinLeadsScraper,
  ) {}
  async findLeads(keyword: string, location: string) {
    const limit = pLimit(2);
    const scraperBrowser = this.browserProvider.getBrowser();
    const googleMapsLeads = await this.googleMapsScraper.scrape(
      scraperBrowser,
      keyword,
      location,
    );

    const leads = await Promise.all(
      googleMapsLeads.map((lead) =>
        limit(async () => {
          try {
            const linkedinUrl =
              await this.linkedinLeadsScraper.scrapeLinkedinSearch(
                scraperBrowser,
                lead.name,
                location,
              );

            return { ...lead, linkedinUrl };
          } catch (err) {
            console.log(`Skipping ${lead.name} due to error: ${err.message}`);
            return { ...lead, linkedinUrl: "" };
          }
        }),
      ),
    );

    return leads;
  }
}
