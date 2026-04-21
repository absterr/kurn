import { Injectable } from "@nestjs/common";
import { Locator, Page } from "playwright";
import { BrowserContextProvider } from "src/lib/providers/browser-context-provider";

export interface Job {
  title: string;
  link: string;
  location: string;
  date: string;
  applicants: string;
  description: string;
  companyName: string;
  companyLink: string;
}

@Injectable()
export class LinkedinJobsScraper {
  constructor(
    private readonly browserContextProvider: BrowserContextProvider,
  ) {}

  private async getJobDetails(page: Page, card: Locator) {
    await card.click().catch(() => null);

    const detailsPanel = page.locator(".jobs-details__main-content");

    const companyEl = detailsPanel.locator(
      ".job-details-jobs-unified-top-card__company-name a",
    );
    const companyName = (await companyEl.textContent())?.trim() || "";
    const companyLink =
      (await companyEl.getAttribute("href"))?.replace(/\/life\/?$/, "") || "";

    const descEl = detailsPanel.locator("#job-details").locator("p");
    const description = (await descEl.innerText())?.trim() || "";

    const metaEl = detailsPanel.locator(
      ".job-details-jobs-unified-top-card__tertiary-description-container",
    );
    const metaRaw = (await metaEl.innerText()) || "";
    // _ REPRESENTS REGION
    const [_, date, rest] = metaRaw.split("·").map((s) => s.trim());
    const applicants = rest.split("\n\n")[0].trim();

    return {
      date,
      applicants,
      description,
      companyName,
      companyLink,
    };
  }

  async scrape(position: string) {
    const sesssionPath = this.browserContextProvider.linkedinSessionPath;
    const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(position)}`;

    const context = await this.browserContextProvider.getContext(sesssionPath);
    const page = await context.newPage();

    try {
      await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

      const searchInput = page.locator(
        "input.jobs-search-global-typeahead__input",
      );
      await searchInput.waitFor({ state: "visible" });
      await searchInput.click();
      await searchInput.fill(position);
      await page.keyboard.press("Enter");
      await page.waitForLoadState("domcontentloaded");

      const resultsFilterDropdown = page.locator(
        "#navigational-filter_resultType",
      );
      await resultsFilterDropdown.isVisible().catch(() => null);
      const jobs = page.locator('.artdeco-dropdown__item:has-text("Jobs")');
      await jobs.click().catch(() => false);

      const searchResults = page.locator("li[data-occludable-job-id]");
      await searchResults
        .first()
        .isVisible()
        .catch(() => null);

      const results: Job[] = [];
      const maxResults = 5;
      const count = Math.min(await searchResults.count(), maxResults);

      for (let i = 0; i < count; i++) {
        const card = searchResults.nth(i);

        const titleEl = card.locator("a.job-card-list__title--link");
        const locationEl = card.locator(
          ".job-card-container__metadata-wrapper li span",
        );

        const jobTitle = (await titleEl.innerText()) || "";
        const jobUrl = await titleEl.getAttribute("href");
        const location = (await locationEl.first().textContent())?.trim() || "";
        const title = jobTitle.split("\n")[0].trim();
        const details = await this.getJobDetails(page, card);

        results.push({
          title,
          link: jobUrl ? `https://www.linkedin.com${jobUrl.split("?")[0]}` : "",
          location,
          ...details,
        });
      }

      return results;
    } finally {
      await context.close();
    }
  }
}
