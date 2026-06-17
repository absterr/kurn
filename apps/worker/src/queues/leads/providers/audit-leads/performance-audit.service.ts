import { Page } from "playwright";

declare global {
  interface Window {
    __vitals?: WebVitalsState;
  }
}

export interface CoreWebVitals {
  ttfbMs: number | null;
  fcpMs: number | null;
  lcpMs: number | null;
  cls: number | null;
  inpMs: number | null;
}

interface WebVitalsState {
  lcp: number | null;
  cls: number;
  inpCandidates: number[];
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface EventTimingEntry extends PerformanceEntry {
  duration: number;
}

export class PerformanceAuditService {
  async injectWebVitalsCollector(page: Page) {
    await page.addInitScript(() => {
      window.__vitals = {
        lcp: null,
        cls: 0,
        inpCandidates: [],
      };

      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) window.__vitals!.lcp = last.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        // LCP not supported in this engine/context
      }

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as LayoutShiftEntry[]) {
            if (!entry.hadRecentInput) {
              window.__vitals!.cls += entry.value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
      } catch {
        // CLS not supported
      }

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as EventTimingEntry[]) {
            if (typeof entry.duration === "number") {
              window.__vitals!.inpCandidates.push(entry.duration);
            }
          }
          /*
            durationThreshold lowers the default 104ms cutoff so a quick
            simulated click still shows up as an entry.
          */
        }).observe({
          type: "event",
          buffered: true,
          durationThreshold: 16,
        } as PerformanceObserverInit & {
          durationThreshold: number;
        });
      } catch {
        // Event Timing API not supported
      }
    });
  }

  async collectWebVitals(page: Page): Promise<CoreWebVitals> {
    return page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const paint = performance.getEntriesByType("paint");
      const fcpEntry = paint.find((p) => p.name === "first-contentful-paint");
      const v = window.__vitals ?? {
        lcp: null,
        cls: 0,
        inpCandidates: [],
      };

      return {
        ttfbMs: nav ? Math.round(nav.responseStart - nav.startTime) : null,
        fcpMs: fcpEntry ? Math.round(fcpEntry.startTime) : null,
        lcpMs: v.lcp !== null ? Math.round(v.lcp) : null,
        cls: v.cls !== null ? Math.round(v.cls * 1000) / 1000 : null,
        inpMs: v.inpCandidates.length
          ? Math.round(Math.max(...v.inpCandidates))
          : null,
      };
    });
  }

  async simulateInteraction(page: Page) {
    try {
      await page.mouse.move(50, 50);
      await page.mouse.click(50, 50);
    } catch {
      /*
        Some pages intercept/crash on a blind click at a fixed coordinate
        Safe to ignore, INP will just come back null for that run.
      */
    }
  }
}
