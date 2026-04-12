import { Module } from "@nestjs/common";
import { BrowserContextProvider } from "./providers/browser-context-provider";
import { LinkedinAuth } from "./providers/linkedin-auth";
import { WebCrawler } from "./providers/web-crawler";

@Module({
  providers: [BrowserContextProvider, LinkedinAuth, WebCrawler],
  exports: [BrowserContextProvider, LinkedinAuth, WebCrawler],
})
export class SharedModule {}
