import { Module } from "@nestjs/common";
import { BrowserContextProvider } from "./browser-context-provider";
import { LinkedinAuth } from "./linkedin-auth";
import { WebCrawler } from "./web-crawler";

@Module({
  providers: [BrowserContextProvider, LinkedinAuth, WebCrawler],
  exports: [BrowserContextProvider, LinkedinAuth, WebCrawler],
})
export class SharedModule {}
