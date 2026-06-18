import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { Page } from "playwright";
import { ConsoleIssue, FailedRequest } from "@/utils/audit-types";

@Injectable()
export class UiAuditService {
  private readonly screenshotDir = path.join(
    process.cwd(),
    "audit-screenshots",
  );

  constructor() {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  setupListeners(page: Page) {
    const consoleIssues: ConsoleIssue[] = [];
    const failedRequests: FailedRequest[] = [];

    page.on("console", (msg) => {
      const type = msg.type();
      if (type === "error" || type === "warning") {
        consoleIssues.push({
          type,
          text: msg.text(),
          location: msg.location()?.url,
        });
      }
    });

    page.on("pageerror", (err) => {
      consoleIssues.push({ type: "uncaught-exception", text: err.message });
    });

    page.on("requestfailed", (request) => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure()?.errorText ?? null,
        resourceType: request.resourceType(),
      });
    });

    return { consoleIssues, failedRequests };
  }

  async captureScreenshot(page: Page, viewportName: string): Promise<string> {
    const screenshotPath = path.join(
      this.screenshotDir,
      `${viewportName}-${Date.now()}.png`,
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }
}
