import { Injectable } from "@nestjs/common";
import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { Jobs } from "src/db/types";
import {
  ExperienceLevel,
  JobsV1Dto,
  TimeframePosted,
  WorkplaceType,
} from "src/jobs/v1/jobs.v1.dto";
import { BrowserContextProvider } from "src/lib/shared/browser-context-provider";

export type NewJob = Omit<
  Jobs,
  "id" | "jobQueryId" | "createdAt" | "updatedAt"
>;

@Injectable()
export class LinkedinJobsScraper {
  constructor(
    private readonly browserContextProvider: BrowserContextProvider,
  ) {}

  private async setTimeframe(page: Page, timeframePosted: TimeframePosted) {
    if (timeframePosted === "Any time") return;

    const timeframeFilterDropdown = page.locator(
      "#searchFilter_timePostedRange",
    );
    await timeframeFilterDropdown.click().catch(() => null);

    const dropdownContainer = page
      .locator(".reusable-search-filters-trigger-dropdown__container")
      .filter({ hasText: "Date Posted" });
    await dropdownContainer.waitFor({ state: "visible" });

    const valueMap = {
      "Any time": "",
      "Past month": "r2592000",
      "Past week": "r604800",
      "Past 24 hours": "r86400",
    };

    const value = valueMap[timeframePosted];
    const option = dropdownContainer.locator(
      `input[name="date-posted-filter-value"][value="${value}"]`,
    );
    await option.check().catch(() => null);

    const showResultsBtn = page.locator(
      'button.artdeco-button--primary:has-text("Show")',
    );

    if (await showResultsBtn.isVisible().catch(() => false)) {
      await showResultsBtn.click().catch(() => null);
    }

    // LIKELY UNNECESSARY
    await page.waitForLoadState("domcontentloaded");
  }

  private async setExperienceLevel(
    page: Page,
    experienceLevel: ExperienceLevel[],
  ) {
    if (!experienceLevel.length) return;

    const LEVEL_MAP: Record<ExperienceLevel, string> = {
      Internship: "1",
      "Entry level": "2",
      Associate: "3",
      "Mid-Senior level": "4",
      Director: "5",
      Executive: "6",
    };

    const expLevelDropdown = page.locator("#searchFilter_experience");
    const dropdownId =
      (await expLevelDropdown.getAttribute("aria-controls")) ?? "";
    await expLevelDropdown.click();
    const container = page.locator(`#${dropdownId}`);
    await container.waitFor({ state: "visible" });

    for (const level of experienceLevel) {
      const value = LEVEL_MAP[level];
      const levelCheckbox = container.locator(
        `label[for="experience-${value}"]`,
      );

      await levelCheckbox.click().catch(() => null);
      // CHECK IF CHECKBOX IS CHECKED
      await expect(levelCheckbox).toBeChecked();
    }

    await container
      .locator('button[aria-label="Apply current filter to show results"]')
      .click();

    await page.waitForLoadState("domcontentloaded");
  }

  private async setWorkType(page: Page, workplaceType: WorkplaceType[]) {
    if (!workplaceType.length) return;

    const WORK_TYPE_MAP: Record<WorkplaceType, string> = {
      Remote: "2",
      "On-site": "1",
      Hybrid: "3",
    };

    const workTypeDropdown = page.locator("#searchFilter_workplaceType");
    const dropdownId = await workTypeDropdown.getAttribute("aria-controls");
    await workTypeDropdown.click();
    const container = page.locator(`#${dropdownId}`);
    await container.waitFor({ state: "visible" });

    for (const type of workplaceType) {
      const value = WORK_TYPE_MAP[type];
      const typeCheckBox = container.locator(
        `label[for="workplaceType-${value}"]`,
      );

      await typeCheckBox.check().catch(() => null);
      // CHECK IF CHECKBOX IS CHECKED
      await expect(typeCheckBox).toBeChecked();
    }

    await container
      .locator('button[aria-label="Apply current filter to show results"]')
      .click();

    await page.waitForLoadState("domcontentloaded");
  }

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
    const description = (await descEl.allInnerTexts())
      .map((t) => t.trim())
      .filter(Boolean)
      .join("\n\n");

    const metaEl = detailsPanel.locator(
      ".job-details-jobs-unified-top-card__tertiary-description-container",
    );
    const metaRaw = (await metaEl.innerText()) || "";
    // _ IS THE REGION
    const [_, date, rest] = metaRaw.split("·").map((s) => s.trim());
    const applicantsCount = rest.split("\n\n")[0].trim();

    return {
      date,
      applicantsCount,
      description,
      companyName,
      companyLink,
    };
  }

  async scrape(dto: JobsV1Dto) {
    const {
      userId,
      experienceLevel,
      position,
      timeframePosted,
      workplaceType,
    } = dto;

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
      await resultsFilterDropdown.click().catch(() => null);

      const jobs = page.locator('.artdeco-dropdown__item:has-text("Jobs")');
      await jobs.waitFor({ state: "visible" });
      await jobs.click().catch(() => null);

      await this.setTimeframe(page, timeframePosted);
      await this.setExperienceLevel(page, experienceLevel);
      await this.setWorkType(page, workplaceType);

      const searchResults = page.locator("li[data-occludable-job-id]");
      await searchResults
        .first()
        .isVisible()
        .catch(() => null);

      const results: NewJob[] = [];
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
          userId,
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
