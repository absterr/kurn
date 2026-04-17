import { Injectable } from "@nestjs/common";
import { BrowserContextProvider } from "src/lib/providers/browser-context-provider";

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

      if (await resultsFilterDropdown.isVisible().catch(() => false)) {
        const jobs = page.locator('.artdeco-dropdown__item:has-text("Jobs")');
        await jobs.click().catch(() => false);
      }

      const hasResults = await page
        .locator("li[data-occludable-job-id]")
        .first()
        .isVisible()
        .catch(() => false);

      if (!hasResults) {
        return [];
      }

      return hasResults;
    } finally {
      await context.close();
    }
  }
}
