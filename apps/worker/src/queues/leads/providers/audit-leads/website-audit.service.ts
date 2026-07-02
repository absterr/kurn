import { Injectable } from "@nestjs/common";
import { BrowserContextOptions, devices } from "playwright";
import { BrowserContextProvider } from "@/lib/shared/browser-context-provider";
import { WebCrawler } from "@/lib/shared/web-crawler";
import {
  CoreWebVitals,
  ViewportAuditResult,
  ViewportName,
  WebsiteAuditResult,
} from "@/queues/leads/leads.schema";
import { PerformanceAuditService } from "./performance-audit.service";
import { UiAuditService } from "./ui-audit.service";

interface ViewportProfile {
  name: ViewportName;
  contextOptions: BrowserContextOptions;
}

@Injectable()
export class WebsiteAuditService {
  private readonly profiles: ViewportProfile[] = [
    {
      name: "mobile",
      contextOptions: { ...devices["iPhone 13"] },
    },
    {
      name: "tablet",
      contextOptions: { ...devices["iPad (gen 7)"] },
    },
    {
      name: "desktop",
      contextOptions: {
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
      },
    },
  ];

  constructor(
    private readonly browserContextProvider: BrowserContextProvider,
    private readonly uiAuditService: UiAuditService,
    private readonly performanceAuditService: PerformanceAuditService,
    private readonly webCrawler: WebCrawler,
  ) {}

  async auditWebsite(websiteUrl: string): Promise<WebsiteAuditResult> {
    const viewports = await Promise.all(
      this.profiles.map((profile) => this.auditViewport(websiteUrl, profile)),
    );

    return {
      auditedAt: new Date().toISOString(),
      viewports,
    };
  }

  async crawlEmails(websiteUrl: string): Promise<string[]> {
    const context = await this.browserContextProvider.getContext();
    const page = await context.newPage();
    try {
      await page.goto(websiteUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      return await this.webCrawler.extractEmails(page);
    } catch {
      return [];
    } finally {
      await page.close();
      await context.close();
    }
  }

  private async auditViewport(
    url: string,
    profile: ViewportProfile,
  ): Promise<ViewportAuditResult> {
    const context = await this.browserContextProvider.getContext(
      profile.contextOptions,
    );
    const page = await context.newPage();

    let httpStatus: number | null = null;
    let totalLoadTimeMs = 0;
    let vitals: CoreWebVitals = {
      ttfbMs: null,
      fcpMs: null,
      lcpMs: null,
      cls: null,
      inpMs: null,
    };
    let screenshotPath = "";
    let errorMessage: string | undefined;

    const { consoleIssues, failedRequests } =
      this.uiAuditService.setupListeners(page);

    try {
      await this.performanceAuditService.injectWebVitalsCollector(page);

      const start = Date.now();
      const response = await page.goto(url, {
        waitUntil: "load",
        timeout: 30000,
      });
      totalLoadTimeMs = Date.now() - start;
      httpStatus = response?.status() ?? null;

      await page.waitForTimeout(1500);
      await this.performanceAuditService.simulateInteraction(page);
      await page.waitForTimeout(500);

      vitals = await this.performanceAuditService.collectWebVitals(page);
      screenshotPath = await this.uiAuditService.captureScreenshot(
        page,
        profile.name,
      );
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : String(err);
    } finally {
      await page.close();
      await context.close();
    }

    return {
      viewport: profile.name,
      screenshotPath,
      httpStatus,
      totalLoadTimeMs,
      vitals,
      consoleIssues,
      failedRequests,
      error: errorMessage,
    };
  }
}
