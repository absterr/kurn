import { resolveMx } from "node:dns/promises";
import { Injectable } from "@nestjs/common";
import { validate } from "email-validator";
import { Page } from "playwright";

@Injectable()
export class WebCrawler {
  private readonly emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
  private readonly MAX_PAGES = 10;

  private normalizeUrl(link: string) {
    let newLink = link.split("#")[0].trim();
    if (!newLink.startsWith("http")) newLink = `https://${newLink}`;

    return newLink.endsWith("/") ? newLink.slice(0, -1) : newLink;
  }

  private async verifyEmail(email: string) {
    const isValid = validate(email);
    if (!isValid) return false;

    const domain = email.split("@")[1];

    try {
      const mx = await resolveMx(domain);
      return mx.length > 0;
    } catch {
      return false;
    }
  }

  async extractEmails(page: Page, maxDepth = 1): Promise<string[]> {
    const context = page.context();
    const initialUrl = this.normalizeUrl(page.url());

    let depth = 0;
    let currentUrls = new Set([initialUrl]);
    const emails = new Set<string>();
    const visitedUrls = new Set<string>();

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
          const isInitial = url === initialUrl;
          const targetPage = isInitial ? page : await context.newPage();

          try {
            if (!isInitial) {
              await targetPage.goto(url, { waitUntil: "domcontentloaded" });
            }

            const bodyText = (await targetPage.innerText("body")).replace(
              /\s+/g,
              " ",
            );
            const matches = bodyText.match(this.emailRegex) || [];
            matches.forEach((e) => {
              emails.add(e.toLowerCase());
            });

            if (depth < maxDepth) {
              const origin = new URL(url).origin;
              const links = await targetPage.$$eval(
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
            // Ignore navigation errors
          } finally {
            if (!isInitial) {
              await targetPage.close();
            }
          }
        }),
      );

      currentUrls = nextUrls;
      depth++;
    }

    const emailList = Array.from(emails);
    const verifiedEmails: string[] = [];
    const verified = await Promise.all(
      emailList.map((email) => this.verifyEmail(email)),
    );

    for (let i = 0; i < emailList.length; i++) {
      if (verified[i]) {
        verifiedEmails.push(emailList[i]);
      }
    }

    return verifiedEmails;
  }
}
