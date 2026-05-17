interface OutreachInput {
  company: string;
  audit: {
    hasWebsite: boolean;
    websiteIsReachable: boolean;
    diagnosis: string[];
  };
}

export const EMAIL_SYSTEM_PROMPT = (input: OutreachInput) => {
  const { company, audit } = input;

  const websiteStatus = !input.audit.hasWebsite
    ? "no website at all"
    : !input.audit.websiteIsReachable
      ? "a website that is currently unreachable"
      : "a live, reachable website";

  const diagnosisText = audit.diagnosis.length
    ? audit.diagnosis.map((d) => `- ${d}.`).join("\n")
    : "No specific issues were diagnosed beyond the website status above.";

  return `
    You are generating a short, genuine cold outreach email to a business.

    COMPANY:
    ${company}

    AUDIT:
    ${company} has ${websiteStatus}.

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
    `.trim();
};
