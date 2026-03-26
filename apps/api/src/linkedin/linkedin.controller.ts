import { Body, Controller, Post } from "@nestjs/common";
import { GoogleMapsDto } from "src/scraper/google-maps.dto";
import { LinkedinService } from "./linkedin.service";

@Controller("scraper")
export class LinkedinController {
  constructor(private readonly linkedinService: LinkedinService) {}

  @Post("linkedin")
  async(@Body() dto: GoogleMapsDto) {
    return this.linkedinService.scrapeLinkedIn(dto.keyword, dto.location);
  }
}
