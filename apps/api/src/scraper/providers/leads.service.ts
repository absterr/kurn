import { Injectable } from "@nestjs/common";
import { BrowserProvider } from "./browser-provider";
import { GoogleMapsScraper } from "./google-maps.scraper";

@Injectable()
export class LeadsService {
  constructor(
    private readonly googleMapsScraper: GoogleMapsScraper,
    private readonly browserProvider: BrowserProvider,
  ) {}

  async findLeads(keyword: string, location: string) {
    const scraperBrowser = this.browserProvider.getBrowser();
    const googleMapsResults = await this.googleMapsScraper.Scrape(
      scraperBrowser,
      keyword,
      location,
    );

    return googleMapsResults;
  }
}
