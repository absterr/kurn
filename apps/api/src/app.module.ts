import { Module } from "@nestjs/common";
import { CrawlerController } from "./crawler/crawler.controller";
import { CrawlerService } from "./crawler/crawler.service";
import { LeadsV1Module } from "./leads/v1/leads.v1.module";
import { BrowserProvider } from "./leads/v1/providers/browser-provider";
import { TestModule } from "./test/test.module";

@Module({
  imports: [LeadsV1Module, TestModule],
  controllers: [CrawlerController],
  providers: [CrawlerService, BrowserProvider],
})
export class AppModule {}
