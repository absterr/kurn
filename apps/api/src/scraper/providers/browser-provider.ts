import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Browser } from "playwright";
import { chromium } from "playwright-extra";

@Injectable()
export class BrowserProvider implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;

  async onModuleInit() {
    this.browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disabled-setuid-sandbox"],
    });
  }

  getBrowser() {
    return this.browser;
  }

  async onModuleDestroy() {
    await this.browser.close();
  }
}
