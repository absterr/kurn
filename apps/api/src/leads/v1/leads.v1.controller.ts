import { Body, Controller, Post } from "@nestjs/common";
import { LeadsV1Dto } from "./leads.v1.dto";
import { LeadsV1Service } from "./providers/leads.v1.service";

@Controller({ path: "scraper/leads", version: "1" })
export class LeadsV1Controller {
  constructor(private readonly leadsService: LeadsV1Service) {}

  @Post()
  async(@Body() dto: LeadsV1Dto) {
    return this.leadsService.findLeads(dto.keyword, dto.location);
  }
}
