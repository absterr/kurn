import { Body, Controller, Post } from "@nestjs/common";
import { GoogleMapsDto } from "./google-maps.dto";
import { ScraperService } from "./scraper.service";

@Controller("scraper")
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post("google-maps")
  async(@Body() dto: GoogleMapsDto) {
    return this.scraperService.ScrapeGoogleMaps(dto.keyword, dto.location);
  }
}
