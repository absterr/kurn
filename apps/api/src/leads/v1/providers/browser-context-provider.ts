import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Browser, BrowserContextOptions } from "playwright";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

chromium.use(stealth());

@Injectable()
export class BrowserContextProvider implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;

  linkedinSessionPath = "user_data/linkedin-session.json";

  async onModuleInit() {
    this.browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  getContext(storageState?: string) {
    const browserContextOptions: BrowserContextOptions = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: "en-US",
      timezoneId: "Africa/Lagos",
    };

    if (storageState) {
      return this.browser.newContext({
        storageState,
        ...browserContextOptions,
      });
    }

    return this.browser.newContext(browserContextOptions);
  }

  async onModuleDestroy() {
    await this.browser.close();
  }
}
