import { Body, Controller, Post } from "@nestjs/common";
import { LeadsService } from "./providers/leads.service";
import { LeadsDto } from "./scraper.dto";

@Controller("scraper")
export class ScraperController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post("leads")
  async(@Body() dto: LeadsDto) {
    return this.leadsService.findLeads(dto.keyword, dto.location);
  }
}
