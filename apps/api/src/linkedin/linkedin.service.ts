import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import playwright, { Browser } from "playwright";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

chromium.use(stealth());

@Injectable()
export class LinkedinService implements OnModuleInit, OnModuleDestroy {
  private scraperBrowser: Browser;
  private sessionPath = "user_data/linkedin-session.json";

  async onModuleInit() {
    this.scraperBrowser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disabled-setuid-sandbox"],
    });
  }

  async loginLinkedIn() {
    const authBrowser = await playwright.chromium.launch({
      headless: false,
    });

    const context = await authBrowser.newContext();
    const page = await context.newPage();

    try {
      await page.goto("https://www.linkedin.com/login");
      await page.waitForURL(/linkedin\.com\/feed/, {
        timeout: 0,
      });
      await context.storageState({ path: this.sessionPath });
    } catch {
      throw new Error("Login aborted");
    } finally {
      await authBrowser.close();
    }
  }

  private ctx() {
    return this.scraperBrowser.newContext({
      storageState: this.sessionPath,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: "en-US",
      timezoneId: "Africa/Lagos",
    });
  }

  async scrapeLinkedIn(keyword: string, location?: string) {
    const searchUrl = location
      ? `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(`${keyword} ${location}`)}`
      : `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(keyword)}`;

    mkdirSync(dirname(this.sessionPath), { recursive: true });

    if (!existsSync(this.sessionPath)) await this.loginLinkedIn();

    let context = await this.ctx();

    let page = await context.newPage();

    try {
      await page.goto(searchUrl);

      if (page.url().includes("login")) {
        await context.close();
        await this.loginLinkedIn();

        context = await this.ctx();

        page = await context.newPage();
        await page.goto(searchUrl);
      }

      await page.waitForSelector("body");

      const leads = await page.evaluate(() => {
        const cards = Array.from(
          document.querySelectorAll(
            'li div[data-view-name="search-entity-result-universal-template"]',
          ),
        );

        return cards
          .map((card) => {
            const linkEl = card.querySelector('a[href*="/company/"]');
            const nameEl = linkEl;
            const metaEl = card.querySelector(".t-14.t-black.t-normal");

            return {
              name: nameEl?.textContent?.trim() || "",
              linkedinUrl: linkEl?.getAttribute("href")?.split("?")[0] || "",
              location: metaEl?.textContent?.trim() || "",
            };
          })
          .filter((l) => l.name && l.linkedinUrl);
      });

      return leads;
    } finally {
      await context.close();
    }
  }

  async onModuleDestroy() {
    await this.scraperBrowser.close();
  }
}
