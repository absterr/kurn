import { Body, Controller, Post } from "@nestjs/common";
import { CrawlerDto } from "./crawler.dto";
import { CrawlerService } from "./crawler.service";

@Controller("crawler")
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post()
  async(@Body() dto: CrawlerDto) {
    return this.crawlerService.extractEmails(dto.website);
  }
}
