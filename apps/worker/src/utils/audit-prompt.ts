import * as fs from "node:fs/promises";
import { Part } from "@google/genai";
import { ViewportAuditResult, WebsiteAuditResult } from "./audit-types";

export interface LeadContext {
  companyName: string;
  website: string;
}

type VitalRating = "good" | "needs improvement" | "poor" | "unknown";

const SYSTEM_PROMPT = `
  You are a website audit analyst supporting an outbound sales team.
  You read structured technical audit data for a small business's website and
  turn it into a short list of plain-language diagnostic tags a salesperson can
  use as talking points when reaching out to that business.

  For each viewport (mobile, tablet, desktop) you will be given a metrics summary
  followed by a screenshot of how the page actually rendered there. Use the
  screenshot to judge things the metrics can't tell you: cluttered or dated design,
  broken or overlapping layout elements, illegible text or poor contrast, low-quality
  or stretched images, and whether the mobile screenshot looks genuinely usable
  rather than just fast to load.

  If a screenshot is missing for a viewport, judge that viewport on its metrics alone.

  RULES:
  - Base every tag strictly on the audit data given to you below. Do not infer or invent issues about anything not covered by this data.
  - Each tag is 2-5 words, plain language, no technical jargon. Say "slow page load," never "high LCP" or "TTFB."
  - Capitalize only the first letter of each tag, matching this style: "No website", "Weak online presence".
  - Return between 2 and 5 tags, most severe first.
  - If several signals point to the same underlying problem (e.g. a high layout-shift score and a screenshot with obviously misaligned elements), combine them into one tag instead of listing each separately.
  - If mobile results are meaningfully worse than desktop, add one tag for that rather than repeating numbers per device.
  - If the data and screenshots show no significant issues, return exactly one tag describing the site positively (e.g. "Strong web presence"). Never return an empty array.
  - Respond with raw JSON only. No markdown code fences, no commentary, no explanation. Output must match exactly this shape: {"auditDiagnosis": ["...", "..."]}

  Reference thresholds (already applied to the ratings in the data below, given here only for your context):
  - Time to first byte: good <= 800ms, poor > 1800ms
  - First contentful paint: good <= 1.8s, poor > 3s
  - Largest contentful paint: good <= 2.5s, poor > 4s
  - Cumulative layout shift: good <= 0.1, poor > 0.25
  - Interaction latency: good <= 200ms, poor > 500ms (This is a single simulated click, not a real user session. Treat it as directional only, not a precise measurement)
`.trim();

const fmtMs = (value: number | null) => {
  if (value === null) return "n/a";
  return value >= 1000
    ? `${(value / 1000).toFixed(1)}s`
    : `${Math.round(value)}ms`;
};

const classify = (
  value: number | null,
  good: number,
  poor: number,
): VitalRating => {
  if (value === null) return "unknown";
  if (value <= good) return "good";
  if (value > poor) return "poor";
  return "needs improvement";
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const summarizeViewport = (v: ViewportAuditResult) => {
  const { vitals } = v;
  const lines = [
    `${capitalize(v.viewport)}:`,
    `  HTTP status: ${v.httpStatus ?? "unknown"}`,
    `  Total load time: ${fmtMs(v.totalLoadTimeMs)}`,
    `  Time to first byte: ${fmtMs(vitals.ttfbMs)} (${classify(vitals.ttfbMs, 800, 1800)})`,
    `  First contentful paint: ${fmtMs(vitals.fcpMs)} (${classify(vitals.fcpMs, 1800, 3000)})`,
    `  Largest contentful paint: ${fmtMs(vitals.lcpMs)} (${classify(vitals.lcpMs, 2500, 4000)})`,
    `  Cumulative layout shift: ${vitals.cls ?? "unknown"} (${classify(vitals.cls, 0.1, 0.25)})`,
    `  Interaction latency (single-sample proxy): ${fmtMs(vitals.inpMs)} (${classify(vitals.inpMs, 200, 500)})`,
    `  Console errors/warnings: ${v.consoleIssues.length}`,
    `  Failed network requests: ${v.failedRequests.length}`,
  ];
  if (v.error) lines.push(`  Audit error: ${v.error}`);
  return lines.join("\n");
};

const screenshotToImagePart = async (
  screenshotPath: string,
): Promise<Part | null> => {
  if (!screenshotPath) return null;
  try {
    const buffer = await fs.readFile(screenshotPath);
    return {
      inlineData: {
        mimeType: "image/png",
        data: buffer.toString("base64"),
      },
    };
  } catch {
    return null;
  }
};

export const buildAuditDiagnosisPrompt = async (
  lead: LeadContext,
  audit: WebsiteAuditResult,
) => {
  const introLines = [
    `Business: ${lead.companyName}`,
    `Website: ${lead.website}`,
  ];

  const user: Part[] = [{ text: introLines.join("\n") }];

  for (const viewport of audit.viewports) {
    user.push({ text: summarizeViewport(viewport) });

    const imagePart = await screenshotToImagePart(viewport.screenshotPath);
    if (imagePart) {
      user.push({ text: `Screenshot of the ${viewport.viewport} view: ` });
      user.push(imagePart);
    } else {
      user.push({
        text: `(No screenshot available for ${viewport.viewport}. Judge this viewport on the metrics above only.)`,
      });
    }
  }

  user.push({ text: "Return the diagnosis now as JSON only." });

  return { system: SYSTEM_PROMPT, user };
};
