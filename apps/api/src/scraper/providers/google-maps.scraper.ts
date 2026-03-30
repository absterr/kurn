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
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
    });

    const page = await context.newPage();
    await page.route("**/*.{png,jpg,jpeg,css,svg}", (route) => route.abort());

    const searchQuery = `${keyword} ${location}`;
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    await page.goto(searchUrl);

    try {
      await page
        .waitForSelector(".Nv2PK", {
          state: "visible",
        })
        .catch(() => null);

      const cards = await page.$$(".Nv2PK");
      const results: Leads[] = [];

      for (const card of cards) {
        const isAd = await card.$(".H931be");
        if (isAd) continue;

        const nameEl = await card.$(".qBF1Pd");
        const linkEl = await card.$("a");

        const leadDetails = {
          name: (await nameEl?.textContent())?.trim() || "",
          mapLink: (await linkEl?.getAttribute("href"))?.trim() || "",
          address: "",
          phone: "",
          website: "",
        };

        await card.click();
        await page.waitForSelector(".AeaXub");

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
      }

      return results;
    } finally {
      await context.close();
    }
  }
}
