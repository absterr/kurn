import { Injectable } from "@nestjs/common";
import { Page } from "playwright";
import { BrowserContextProvider } from "src/lib/providers/browser-context-provider";

export interface Lead {
  name: string;
  mapLink: string;
  address: string;
  phone: string;
  website: string;
}

@Injectable()
export class GoogleMapsScraper {
  constructor(
    private readonly browserContextProvider: BrowserContextProvider,
  ) {}

  private async handleConsentScreen(page: Page) {
    const consentBtn = page
      .locator('button:has-text("Accept all"), button:has-text("Reject all")')
      .first();

    try {
      await consentBtn.waitFor({ state: "visible", timeout: 5000 });
      await consentBtn.click().catch((err) => {
        if (err.name !== "TimeoutError") {
          throw err;
        }
      });
    } catch (err) {
      console.log(`Consent screen not found or timed out: ${err}`);
    }
  }

  private async parseItems(page: Page, mapLink: string) {
    const nameEl = await page.$(".DUwDvf");
    const name = (await nameEl?.textContent())?.trim() || "";
    const items = await page.$$(".AeaXub");

    const lead: Lead = {
      name,
      mapLink,
      address: "",
      phone: "",
      website: "",
    };

    for (const item of items) {
      const icon = await (await item.$("span.google-symbols"))?.textContent();
      const value = (await (await item.$(".Io6YTe"))?.textContent())?.trim();
      if (icon?.includes("")) lead.address = value || "";
      if (icon?.includes("")) lead.phone = value || "";
      if (icon?.includes("")) lead.website = value || "";
    }

    return lead;
  }

  async scrape(keyword: string, location: string) {
    const context = await this.browserContextProvider.getContext();
    const searchQuery = `${keyword} ${location}`;
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    const results: Lead[] = [];
    const page = await context.newPage();

    await page.route("**/*.{png,jpg,jpeg,css,svg}", (route) => route.abort());
    await page.goto(searchUrl);

    const isConsentScreen = await page
      .locator("text=Before you continue to Google")
      .isVisible()
      .catch(() => false);

    if (isConsentScreen) {
      await this.handleConsentScreen(page);
      await page.goto(searchUrl);
    }

    try {
      await page
        .waitForSelector(".Nv2PK, .DUwDvf", { timeout: 5000 })
        .catch(() => null);

      const isList = await page.$(".Nv2PK");
      const isSingle = await page.$(".DUwDvf");

      if (isList) {
        const feed = await page.$('.m6QErb[role="feed"]');
        const maxResults = 8;
        const prevNames = new Set<string>();
        let prevCardCount = 0;
        let idleScrolls = 0;

        while (feed && results.length < maxResults) {
          const cards = page.locator(".Nv2PK");
          const cardCount = await cards.count();

          if (cardCount === prevCardCount) {
            idleScrolls++;
            if (idleScrolls > 2) break;
          } else {
            idleScrolls = 0;
            prevCardCount = cardCount;
          }

          for (let i = 0; i < Math.min(cardCount, maxResults); i++) {
            const card = cards.nth(i);

            const isAd = await card.locator(".H931be").count();
            if (isAd) continue;

            const targetName =
              (await card.locator(".qBF1Pd").textContent())?.trim() || "";
            if (prevNames.has(targetName)) continue;

            await Promise.all([
              await card.click(),
              await page.waitForURL((url) => url.href.includes("/maps/place")),
            ]);

            const loaded = await page
              .waitForFunction((targetName) => {
                const currName =
                  document.querySelector(".DUwDvf")?.textContent.trim() || "";
                return currName === targetName;
              }, targetName)
              .catch(() => false);

            if (loaded) {
              const linkEl = card.locator('a[href*="/maps/place"]').first();
              const mapLink =
                (await linkEl.getAttribute("href"))?.split("?")[0] ||
                page.url().split("?")[0];
              const lead = await this.parseItems(page, mapLink);
              results.push(lead);
              prevNames.add(targetName);
            }
          }

          await feed.evaluate((el) => el.scrollBy(0, 1000));
          await page.waitForTimeout(1000);
        }
      } else if (isSingle) {
        await page.waitForURL((url) => url.href.includes("/maps/place"));
        const mapLink = page.url().split("?")[0];
        const lead = await this.parseItems(page, mapLink);
        results.push(lead);
      }

      return results;
    } finally {
      await context.close();
    }
  }

  // Because sometimes the scrape method returns an empty array
  async fallbackScrape(keyword: string, location: string) {
    const maxRetries = 3;

    for (let i = 0; i < maxRetries; i++) {
      const results = await this.scrape(keyword, location);

      if (results.length > 0) return results;

      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }

    return [];
  }
}
