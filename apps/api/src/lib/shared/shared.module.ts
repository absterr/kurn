import { Module } from "@nestjs/common";
import { BrowserContextProvider } from "./browser-context-provider";
import { WebCrawler } from "./web-crawler";

@Module({
  providers: [BrowserContextProvider, WebCrawler],
  exports: [BrowserContextProvider, WebCrawler],
})
export class SharedModule {}
