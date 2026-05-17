import { Injectable } from "@nestjs/common";
import { AuditLeadsService } from "./audit-leads.service";
import { GoogleMapsScraper } from "./google-maps.scraper";
import { OutreachService } from "./outreach.service";

@Injectable()
export class LeadsV1Service {
  constructor(
    private readonly auditLeadsService: AuditLeadsService,
    private readonly googleMapsScraper: GoogleMapsScraper,
    private readonly outreachService: OutreachService,
  ) {}

  async findLeads(keyword: string, location: string) {
    const googleMapsLeads = await this.googleMapsScraper.fallbackScrape(
      keyword,
      location,
    );

    if (googleMapsLeads.length === 0) return [];

    const auditedLeads =
      await this.auditLeadsService.auditLeads(googleMapsLeads);

    const leadsWithEmail = auditedLeads.filter(
      (lead) => lead.emails.length > 0,
    );

    if (leadsWithEmail.length === 0) return auditedLeads;

    const leadsWithDrafts =
      await this.outreachService.generateEmail(leadsWithEmail);

    return leadsWithDrafts;
  }
}
