import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import playwright, { Browser } from "playwright";

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;

  async onModuleInit() {
    this.browser = await playwright.chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disabled-setuid-sandbox"],
    });
  }

  async ScrapeGoogleMaps(keyword: string, location: string) {
    const context = await this.browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
    });

    const page = await context.newPage();
    await page.route("**/*.{png,jpg,jpeg,css,svg}", (route) => route.abort());

    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(keyword)}+${encodeURIComponent(location)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle" });

    try {
      const leads = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll(".Nv2PK"));

        return elements
          .map((el) => {
            const name = el.querySelector(".qBF1Pd")?.textContent.trim() || "";
            const address =
              el.querySelector(".rllt__details span")?.textContent.trim() || "";
            const website = el.querySelector("a")?.getAttribute("href") || "";
            const phone =
              el
                .querySelector(".rllt__details span:nth-child(2)")
                ?.textContent.trim() || "";
            const isAds = !!el.querySelector(".H931be");

            return { name, address, website, phone, isAds };
          })
          .filter((lead) => lead.name && !lead.isAds);
      });

      return leads;
    } finally {
      await context.close();
    }
  }

  async onModuleDestroy() {
    await this.browser.close();
  }
}
