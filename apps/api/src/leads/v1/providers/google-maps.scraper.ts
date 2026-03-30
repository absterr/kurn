import { Injectable } from "@nestjs/common";
import { Browser, Page } from "playwright";

export interface Lead {
  name: string;
  mapLink: string;
  address: string;
  phone: string;
  website: string;
}

@Injectable()
export class GoogleMapsScraper {
  private async parseItems(page: Page) {
    const nameEl = await page.$(".DUwDvf");
    const linkEl = await page.$("a");
    const name = (await nameEl?.textContent())?.trim() || "";
    const mapLink = (await linkEl?.getAttribute("href"))?.trim() || page.url();
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

  async scrape(browser: Browser, keyword: string, location: string) {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: "en-US",
    });

    const page = await context.newPage();
    await page.route("**/*.{png,jpg,jpeg,css,svg}", (route) => route.abort());

    const searchQuery = `${keyword} ${location}`;
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    const results: Lead[] = [];

    await page.goto(searchUrl);

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

        while (feed && results.length < maxResults) {
          const cards = await page.$$(".Nv2PK");

          for (const card of cards) {
            const isAd = await card.$(".H931be");
            if (isAd) continue;

            const nameEl = await card.$(".qBF1Pd");
            const name = (await nameEl?.textContent())?.trim() || "";
            if (prevNames.has(name)) continue;

            await card.click();

            const loaded = await page
              .waitForFunction((curr) => {
                const el = document.querySelector(".DUwDvf");
                return el?.textContent && el.textContent.trim() === curr;
              }, name)
              .catch(() => null);

            if (loaded) {
              const lead = await this.parseItems(page);
              results.push(lead);
              prevNames.add(name);
            }
          }

          await feed.evaluate((el) => el.scrollBy(0, 1000));
          await page.waitForTimeout(1000);
        }
      } else if (isSingle) {
        const lead = await this.parseItems(page);
        results.push(lead);
      }

      return results;
    } finally {
      await context.close();
    }
  }
}
