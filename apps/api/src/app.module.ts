import { Module } from "@nestjs/common";
import { ScraperModule } from "./scraper/v1/scraper.v1.module";
import { TestModule } from "./test/test.module";

@Module({
  imports: [ScraperModule, TestModule],
})
export class AppModule {}
