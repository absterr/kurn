interface OutreachInput {
  companyName: string;
  hasWebsite: boolean | null;
  websiteReachable: boolean | null;
  auditDiagnosis: string[] | null;
}

export const EMAIL_SYSTEM_PROMPT = (input: OutreachInput) => {
  const { companyName, hasWebsite, websiteReachable, auditDiagnosis } = input;

  const websiteStatus = !hasWebsite
    ? "no website at all"
    : !websiteReachable
      ? "a website that is currently unreachable"
      : "a live, reachable website";

  const diagnosisText =
    auditDiagnosis !== null && auditDiagnosis.length > 0
      ? auditDiagnosis.map((d) => `- ${d}.`).join("\n")
      : "No specific issues were diagnosed beyond the website status above.";

  return `
    You are generating a short, genuine cold outreach email to a business.

    COMPANY:
    ${companyName}

    AUDIT:
    ${companyName} has ${websiteStatus}.

    DIAGNOSIS:
    ${diagnosisText}

    GOAL:
    Offer a free website audit or quick improvement to their online presence. Reference the specific issues above naturally —
    as if you noticed them while browsing, not as a sales pitch.

    INSTRUCTIONS:
    - Write a short, natural subject line. No clickbait, no all-caps, no exclamation marks.
    - Be concise. 3–5 sentences max. No sign-off. Body only.
    - One concrete observation, one specific offer, one low-friction CTA.
    - Plain conversational English. Do not write like a marketer.
    - No buzzwords, no hype.
    - Do not use bullet points or hyphens inside the email.
    - Do not fabricate issues beyond what is listed above.
    - Do not exaggerate
    - Do not mention "AI", "automated tools", or that this was generated.
    - If no website exists, lead with that gap as the opportunity.
    - Output must match exactly this shape: {"subject": "...", "body": "..."}. Respond with raw JSON only.
    `.trim();
};
