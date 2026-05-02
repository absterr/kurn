import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Injectable } from "@nestjs/common";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import { BrowserContextProvider } from "./browser-context-provider";

chromium.use(stealth());

@Injectable()
export class LinkedinAuth {
  constructor(
    private readonly browserContextProvider: BrowserContextProvider,
  ) {}

  private async loginLinkedIn() {
    const authBrowser = await chromium.launch({
      headless: false,
    });

    const context = await authBrowser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      locale: "en-US",
    });
    const page = await context.newPage();

    try {
      await page.goto("https://www.linkedin.com/login");
      await page.waitForURL(/linkedin\.com\/feed/, {
        timeout: 0,
      });
      await context.storageState({
        path: this.browserContextProvider.linkedinSessionPath,
      });
    } catch {
      throw new Error("Login aborted");
    } finally {
      await authBrowser.close();
    }
  }

  async confirmSession() {
    const sessionPath = this.browserContextProvider.linkedinSessionPath;
    mkdirSync(dirname(sessionPath), { recursive: true });
    if (!existsSync(sessionPath)) {
      await this.loginLinkedIn();
    }

    const context = await this.browserContextProvider.getContext(sessionPath);
    const page = await context.newPage();

    try {
      await page.goto("https://www.linkedin.com/feed", {
        waitUntil: "commit",
        timeout: 5000,
      });

      if (page.url().includes("login")) {
        await context.close();
        await this.loginLinkedIn();
      }
    } finally {
      await context.close();
    }
  }
}
