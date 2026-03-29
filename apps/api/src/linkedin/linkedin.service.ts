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
    const searchQuery = location ? `${keyword} ${location}` : keyword;
    const searchUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(searchQuery)}`;

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

      const searchInput = page.locator(".search-global-typeahead__input");
      await searchInput.waitFor({ state: "visible" });
      await searchInput.click();
      await searchInput.fill(location ? `${keyword} ${location}` : keyword);
      await page.keyboard.press("Enter");
      await page.waitForLoadState("load");

      const companiesTab = page.locator('button[aria-label*="Companies"]');
      if (await companiesTab.isVisible().catch(() => false)) {
        await companiesTab.click();
      }

      await page.waitForSelector(
        'div[data-view-name="search-entity-result-universal-template"]',
      );

      const scrollTries = 10;
      let prevHeight = 0;

      // BOUNDED SCROLL (Address content lazy load)
      for (let i = 0; i < scrollTries; i++) {
        const currHeight = await page.evaluate(
          () => document.body.scrollHeight,
        );

        if (currHeight === prevHeight) break;
        prevHeight = currHeight;

        await page.mouse.wheel(0, 2000);
        await page.waitForTimeout(1000);
      }

      const leads = await page.evaluate(() => {
        const cards = Array.from(
          document.querySelectorAll(
            'div[data-view-name="search-entity-result-universal-template"], div[data-chameleon-result-urn]',
          ),
        );

        return cards
          .map((card) => {
            const anchors = card.querySelectorAll('a[href*="/company/"]');
            const linkEl =
              anchors.length > 0 ? anchors[anchors.length - 1] : null;

            const name = linkEl?.textContent?.trim() || "";
            const linkedinUrl =
              linkEl?.getAttribute("href")?.split("?")[0] || "";

            let companyLocation = "";
            let meta =
              card
                .querySelector(".t-14.t-black.t-normal")
                ?.textContent.trim() || "";

            if (meta.includes("•")) {
              companyLocation = meta.split("•").pop()?.trim() || "";
            } else {
              const metaBlocks = Array.from(card.querySelectorAll("div.t-14"));
              meta =
                metaBlocks
                  .find((el) => el.textContent?.includes(","))
                  ?.textContent?.trim() || "";

              if (meta.includes("•")) {
                companyLocation = meta.split("•").pop()?.trim() || "";
              }
            }

            return {
              name,
              linkedinUrl,
              companyLocation,
              meta,
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
