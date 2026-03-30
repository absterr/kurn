import { Injectable } from "@nestjs/common";
import { Browser } from "playwright";

export interface Leads {
  name: string;
  mapLink: string;
  address: string;
  phone: string;
  website: string;
}

@Injectable()
export class GoogleMapsScraper {
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
    await page.goto(searchUrl);

    try {
      const feed = await page.$('.m6QErb[role="feed"]');
      const maxResults = 8;
      const results: Leads[] = [];

      while (feed && results.length < maxResults) {
        const cards = await page.$$(".Nv2PK");
        let prevName = "";

        for (const card of cards) {
          const isAd = await card.$(".H931be");
          if (isAd) continue;

          const nameEl = await card.$(".qBF1Pd");
          const linkEl = await card.$("a");
          const name = (await nameEl?.textContent())?.trim() || "";
          const mapLink = (await linkEl?.getAttribute("href"))?.trim() || "";

          await card.click();

          await page.waitForFunction((prev) => {
            const el = document.querySelector(".DUwDvf");
            return el?.textContent && el.textContent.trim() !== prev;
          }, prevName);

          prevName = name;

          const leadDetails = {
            name,
            mapLink,
            address: "",
            phone: "",
            website: "",
          };

          const items = await page.$$(".AeaXub");

          for (const item of items) {
            const iconEl = await item.$("span.google-symbols");
            const valueEl = await item.$(".Io6YTe");

            const icon = await iconEl?.textContent();
            const value = (await valueEl?.textContent())?.trim();

            if (icon?.includes("")) leadDetails.address = value?.trim() || "";
            if (icon?.includes("")) leadDetails.phone = value?.trim() || "";
            if (icon?.includes("")) leadDetails.website = value?.trim() || "";
          }

          results.push(leadDetails);
          if (results.length > maxResults) break;

          await feed.evaluate((el) => el.scrollBy(0, 1000));
          await page.waitForTimeout(1000);
        }
      }

      return results;
    } finally {
      await context.close();
    }
  }
}
