import { Injectable } from "@nestjs/common";
import { Page } from "playwright";
import { BrowserContextProvider } from "src/lib/providers/browser-context-provider";

interface Job {
  title: string;
  link: string;
  location: string;
  posted: string;
}

@Injectable()
export class LinkedinLeadsScraper {
  constructor(
    private readonly browserContextProvider: BrowserContextProvider,
  ) {}

  private async getLinkedinUrl(
    page: Page,
    targetName: string,
    targetLocation: string,
  ) {
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
          const linkedinUrl = linkEl?.getAttribute("href")?.split("?")[0] || "";
          let meta =
            card.querySelector(".t-14.t-black.t-normal")?.textContent.trim() ||
            "";

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
      { targetName, targetLocation },
    );

    return linkedinUrl;
  }

  private async getJobOpenings(companyUrl: string, page: Page) {
    const jobsUrl = `${companyUrl.replace(/\/$/, "")}/jobs`;
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
    const seenJobIds = new Set<string>();

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

      for (const job of recentPageJobs) {
        const idMatch = job.link.match(/currentJobId=(\d+)/);
        const jobId = idMatch?.[1];

        if (!jobId || seenJobIds.has(jobId)) continue;
        seenJobIds.add(jobId);
        recentJobs.push(job);
      }

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

  private async getOverview(companyUrl: string, page: Page) {
    const aboutUrl = `${companyUrl.replace(/\/$/, "")}/about`;
    await page.goto(aboutUrl);

    try {
      const isVisible = await page
        .waitForFunction(
          () => {
            const p =
              document
                .querySelector("section.org-about-module__margin-bottom p")
                ?.textContent.trim() || "";

            return p.length > 0;
          },
          { timeout: 5000 },
        )
        .catch(() => false);

      if (!isVisible) return "";

      const overview = await page.$eval(
        "section.org-about-module__margin-bottom p",
        (el) => {
          const rawText = el.textContent || "";
          const blocks = rawText
            .split(/\n/)
            .map((b) => b.trim())
            .filter((b) => b.length > 0);

          // Find the first non stylized/bold unicode character
          const firstText = blocks.find(
            (b) => !/^[\u{1D400}-\u{1D7FF}]/u.test(b),
          );
          const text = (firstText || blocks[0])
            .replace(/^[^a-zA-Z0-9]+/, "")
            .trim();

          return text;
        },
      );

      return overview;
    } catch {
      return "";
    }
  }

  async scrape(name: string, location: string) {
    const sesssionPath = this.browserContextProvider.linkedinSessionPath;
    const searchQuery = `"${name}" ${location}`;
    const searchUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(searchQuery)}`;

    const context = await this.browserContextProvider.getContext(sesssionPath);
    const page = await context.newPage();

    try {
      await page.goto(searchUrl);

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

      const linkedinUrl = await this.getLinkedinUrl(page, name, location);
      if (linkedinUrl.trim()) {
        const overview = await this.getOverview(linkedinUrl, page);
        const jobs = await this.getJobOpenings(linkedinUrl, page);

        return { linkedinUrl, overview, jobs };
      }

      return { linkedinUrl };
    } finally {
      await context.close();
    }
  }
}
