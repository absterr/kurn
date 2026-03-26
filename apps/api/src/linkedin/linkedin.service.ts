import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import playwright, { Browser } from "playwright";

@Injectable()
export class LinkedinService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;

  async onModuleInit() {
    this.browser = await playwright.chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disabled-setuid-sandbox"],
    });
  }

  async loginLinkedIn() {
    const browser = await playwright.chromium.launch({
      headless: false,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto("https://www.linkedin.com/login");
      await page.waitForURL("https://www.linkedin.com/feed", {
        timeout: 0,
      });
      await context.storageState({ path: "linkedin-session.json" });
    } catch {
      throw new Error("Login aborted");
    } finally {
      await browser.close();
    }
  }

  async scrapeLinkedIn(name: string, location?: string) {
    let context: playwright.BrowserContext;
    let page: playwright.Page;

    try {
      context = await this.browser.newContext({
        storageState: "linkedin-session.json",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      });

      page = await context.newPage();
      await page.goto("https://www.linkedin.com/feed");

      if (page.url().includes("login")) {
        await context.close();
        throw new Error("LinkedIn session expired");
      }
    } catch {
      await this.loginLinkedIn();

      context = await this.browser.newContext({
        storageState: "linkedin-session.json",
      });

      page = await context.newPage();
    }
  }

  async onModuleDestroy() {
    await this.browser.close();
  }
}
