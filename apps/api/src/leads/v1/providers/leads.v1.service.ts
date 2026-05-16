import { Injectable } from "@nestjs/common";
import { AuditLeadsService } from "./audit-leads.service";
import { GoogleMapsScraper, Lead } from "./google-maps.scraper";

@Injectable()
export class LeadsV1Service {
  constructor(
    private readonly googleMapsScraper: GoogleMapsScraper,
    private readonly auditLeadsService: AuditLeadsService,
  ) {}

  async findLeads(keyword: string, location: string) {
    const googleMapsLeads = await this.googleMapsScraper.fallbackScrape(
      keyword,
      location,
    );

    if (googleMapsLeads.length === 0) return [];

    const auditedLeads =
      await this.auditLeadsService.auditLeads(googleMapsLeads);

    return auditedLeads;
  }
}
