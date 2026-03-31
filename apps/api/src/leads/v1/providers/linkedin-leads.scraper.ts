import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Injectable } from "@nestjs/common";
import playwright, { Browser, Page } from "playwright";

interface Job {
  title: string;
  link: string;
  location: string;
  posted: string;
}

@Injectable()
export class LinkedinLeadsScraper {
  private sessionPath = "user_data/linkedin-session.json";

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

  private ctx(browser: Browser) {
    return browser.newContext({
      storageState: this.sessionPath,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: "en-US",
      timezoneId: "Africa/Lagos",
    });
  }

  async scrapeJobOpenings(companyUrl: string, page: Page) {
    const jobsUrl = `${companyUrl}/jobs`;
    await page.goto(jobsUrl);

    const results = await Promise.race([
      page
        .waitForSelector(".org-jobs-recently-posted-jobs-module", {
          timeout: 5000,
        })
        .then(() => "FOUND"),
      page
        .waitForSelector(".org-jobs-empty-jobs-module", { timeout: 5000 })
        .then(() => "EMPTY"),
    ]).catch(() => "TIMEOUT");

    if (results !== "FOUND") return [];

    const recentJobs: Job[] = [];

    while (true) {
      const recentPageJobs = await page.$$eval(
        ".org-jobs-recently-posted-job-card__container",
        (cards) =>
          cards.map((card) => {
            const title =
              card
                .querySelector(".job-card-square__title span strong")
                ?.textContent?.trim() || "";

            const link =
              (
                card.querySelector(
                  'a[href*="currentJobId"]',
                ) as HTMLAnchorElement
              )?.href || "";

            const location =
              card
                .querySelector(".job-card-container__metadata-wrapper span")
                ?.textContent?.trim() || "";

            const posted =
              card.querySelector("time")?.textContent?.trim() || "";

            return { title, link, location, posted };
          }),
      );

      recentJobs.push(...recentPageJobs);

      const nextBtn = page.locator(
        'button[aria-label*="Next set of recently posted jobs"]',
      );

      const disabled = await nextBtn.isDisabled().catch(() => true);
      if (disabled) break;

      await nextBtn.click();
      await page.waitForTimeout(1000);
    }

    return recentJobs;
  }

  async scrape(scraperBrowser: Browser, name: string, location: string) {
    const searchQuery = `"${name}" ${location}`;
    const searchUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(searchQuery)}`;

    mkdirSync(dirname(this.sessionPath), { recursive: true });
    if (!existsSync(this.sessionPath)) await this.loginLinkedIn();

    let context = await this.ctx(scraperBrowser);
    let page = await context.newPage();

    try {
      await page.goto(searchUrl);

      if (page.url().includes("login")) {
        await context.close();
        await this.loginLinkedIn();

        context = await this.ctx(scraperBrowser);

        page = await context.newPage();
        await page.goto(searchUrl);
      }

      const searchInput = page.locator(".search-global-typeahead__input");
      await searchInput.waitFor({ state: "visible" });
      await searchInput.click();
      await searchInput.fill(name);
      await page.keyboard.press("Enter");
      await page.waitForLoadState("load");

      const companiesTab = page.locator('button[aria-label*="Companies"]');
      if (await companiesTab.isVisible().catch(() => false)) {
        await companiesTab.click();
      }

      const resultsFound = await Promise.race([
        page
          .waitForSelector('div[data-view-name*="result"]', { timeout: 5000 })
          .then(() => "FOUND"),
        page
          .waitForSelector('[data-view-name="search-results-no-results"]', {
            timeout: 5000,
          })
          .then(() => "EMPTY"),
      ]).catch(() => "TIMEOUT");

      if (resultsFound !== "FOUND") {
        return "";
      }

      const scrollTries = 2;
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

      const linkedinUrl = await page.evaluate(
        ({ targetName, targetLocation }) => {
          const cards = Array.from(
            document.querySelectorAll(
              'div[data-view-name="search-entity-result-universal-template"], div[data-chameleon-result-urn]',
            ),
          );

          for (const card of cards) {
            const anchors = card.querySelectorAll('a[href*="/company/"]');
            const linkEl =
              anchors.length > 0 ? anchors[anchors.length - 1] : null;

            const companyName = linkEl?.textContent?.trim() || "";
            const linkedinUrl =
              linkEl?.getAttribute("href")?.split("?")[0] || "";
            let meta =
              card
                .querySelector(".t-14.t-black.t-normal")
                ?.textContent.trim() || "";

            if (!meta || !meta.includes("•")) {
              const metaBlocks = Array.from(card.querySelectorAll("div.t-14"));
              meta =
                metaBlocks
                  .find((el) => el.textContent?.includes(","))
                  ?.textContent?.trim() || "";
            }

            const companyLocation = meta.split("•").pop()?.trim() || "";

            const isSameName =
              companyName.toLowerCase().includes(targetName.toLowerCase()) ||
              targetName.toLowerCase().includes(companyName.toLowerCase());

            const isSameLocation = companyLocation
              .toLowerCase()
              .includes(targetLocation.toLowerCase());

            if (isSameName && isSameLocation) {
              return linkedinUrl;
            }
          }

          return "";
        },
        { targetName: name, targetLocation: location },
      );

      const jobs = await this.scrapeJobOpenings(linkedinUrl, page);
      return { linkedinUrl, jobs };
    } finally {
      await context.close();
    }
  }
}
