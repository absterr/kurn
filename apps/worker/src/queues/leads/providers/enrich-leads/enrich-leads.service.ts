import { GoogleGenAI } from "@google/genai";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { EnvProvider } from "@/config/env/env.provider";
import { AuditedLead } from "@/utils/audit-types";
import { EMAIL_SYSTEM_PROMPT } from "@/utils/email-prompt";
import { GeneratedEmailDto } from "./enrich-leads.dto";

export interface LeadAuditDetails {
  companyName: string;
  website: string | null;
  emails: string[] | null;
  websiteReachable: boolean | null;
  auditDiagnosis: string[] | null;
}

@Injectable()
export class EnrichLeadsService {
  private readonly genAI: GoogleGenAI;

  constructor(private readonly env: EnvProvider) {
    this.genAI = new GoogleGenAI({ apiKey: this.env.get("GEMINI_API_KEY") });
  }

  async diagnoseLead(lead: AuditedLead) {
    const auditDiagnosis: string[] = [];

    if (!lead.website) {
      auditDiagnosis.push("No website found", "Weak online presence");
      return { ...lead, auditDiagnosis };
    }

    if (!lead.websiteReachable) {
      auditDiagnosis.push("Website is unreachable", "Weak online presence");
      return { ...lead, auditDiagnosis };
    }

    // Diagnose the lead based on website audits if available
  }

  async generateEmail(lead: LeadAuditDetails) {
    const hasWebsite = lead.website !== null;

    const audit = {
      hasWebsite,
      websiteReachable: lead.websiteReachable,
      diagnosis: lead.auditDiagnosis,
    };

    const input = { companyName: lead.companyName, audit };

    const response = await this.genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate the email",
      config: {
        systemInstruction: EMAIL_SYSTEM_PROMPT(input),
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            body: { type: "string" },
          },
          required: ["subject", "body"],
        },
      },
    });

    const result = response.text;
    if (!result) throw new Error("Failed to generate email");

    let parsed: unknown;
    try {
      parsed = JSON.parse(result);
    } catch {
      throw new Error("Invalid JSON response");
    }

    const dto = plainToInstance(GeneratedEmailDto, parsed);
    await validateOrReject(dto);

    const draft = JSON.stringify(dto);
    return draft;
  }
}
