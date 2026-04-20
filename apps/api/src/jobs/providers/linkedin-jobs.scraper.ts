import { Injectable } from "@nestjs/common";
import { BrowserContextProvider } from "src/lib/providers/browser-context-provider";

export interface Job {
  title: string;
  link: string;
  location: string;
}

@Injectable()
export class LinkedinJobsScraper {
  constructor(
    private readonly browserContextProvider: BrowserContextProvider,
  ) {}

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
        const link = await titleEl.getAttribute("href");
        const location = (await locationEl.first().textContent()) || "";

        const title = jobTitle
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean)[0];

        results.push({
          title,
          link: link ? `https://www.linkedin.com${link.split("?")[0]}` : "",
          location: location?.trim(),
        });
      }

      return results;
    } finally {
      await context.close();
    }
  }
}
