import { Injectable } from "@nestjs/common";
import { BrowserProvider } from "./browser-provider";

@Injectable()
export class WebCrawler {
  constructor(private readonly browserProvider: BrowserProvider) {}

  private readonly emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
  private readonly MAX_PAGES = 10;

  private normalizeUrl(link: string) {
    let newLink = link.split("#")[0].trim();
    if (!newLink.startsWith("http")) newLink = `https://${newLink}`;

    return newLink.endsWith("/") ? newLink.slice(0, -1) : newLink;
  }

  async extractEmails(website: string, maxDepth = 1) {
    const browser = this.browserProvider.getBrowser();
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: "en-US",
    });

    let depth = 0;
    let currentUrls = new Set([this.normalizeUrl(website)]);
    const emails = new Set<string>();
    const visitedUrls = new Set<string>();

    try {
      while (
        currentUrls.size > 0 &&
        depth <= maxDepth &&
        visitedUrls.size < this.MAX_PAGES
      ) {
        const nextUrls = new Set<string>();

        const pendingUrls = Array.from(currentUrls)
          .filter((url) => !visitedUrls.has(url))
          .slice(0, this.MAX_PAGES - visitedUrls.size);

        pendingUrls.forEach((url) => {
          visitedUrls.add(url);
        });

        await Promise.all(
          pendingUrls.map(async (url) => {
            const page = await context.newPage();

            try {
              await page.goto(url, { waitUntil: "domcontentloaded" });

              const bodyText = (await page.innerText("body")).replace(
                /\s+/g,
                " ",
              );
              const matches = bodyText.match(this.emailRegex) || [];
              matches.forEach((e) => {
                emails.add(e.toLowerCase());
              });

              if (depth < maxDepth) {
                const origin = new URL(url).origin;
                const links = await page.$$eval(
                  "a[href]",
                  (anchors, base) =>
                    anchors
                      .map((a) => (a as HTMLAnchorElement).href)
                      .filter(
                        (href) =>
                          href.startsWith(base as string) &&
                          !href.startsWith("mailto:"),
                      ),
                  origin,
                );

                for (const link of links) {
                  const normalizedLink = this.normalizeUrl(link);
                  if (!visitedUrls.has(normalizedLink)) {
                    nextUrls.add(normalizedLink);
                  }
                }
              }
            } catch {
              /*
                Ignore navigation errors
              */
            } finally {
              await page.close();
            }
          }),
        );

        currentUrls = nextUrls;
        depth++;
      }

      return Array.from(emails);
    } finally {
      await context.close();
    }
  }
}
