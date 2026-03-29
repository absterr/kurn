import { Body, Controller, Post } from "@nestjs/common";
import { LinkedInDto } from "./linkedin.dto";
import { LinkedinService } from "./linkedin.service";

@Controller("scraper")
export class LinkedinController {
  constructor(private readonly linkedinService: LinkedinService) {}

  @Post("linkedin")
  async(@Body() dto: LinkedInDto) {
    return this.linkedinService.scrapeLinkedIn(dto.keyword, dto.location);
  }
}
