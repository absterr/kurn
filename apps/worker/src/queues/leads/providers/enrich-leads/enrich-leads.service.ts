import * as fs from "node:fs/promises";
import {
  Content,
  Type as GenAIType,
  GenerateContentResponse,
  GoogleGenAI,
  Part,
  Schema,
} from "@google/genai";
import { Injectable } from "@nestjs/common";
import { ZodType } from "zod";
import { EnvProvider } from "@/config/env/env.provider";
import { AuditedLead } from "@/queues/leads/leads.schema";
import { buildAuditDiagnosisPrompt } from "@/utils/audit-prompt";
import { EMAIL_SYSTEM_PROMPT } from "@/utils/email-prompt";
import { formatZodIssues } from "@/utils/format-zod";
import {
  generatedAuditSchema,
  generatedEmailSchema,
} from "./enrich-leads.schema";

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
    } else if (!lead.websiteReachable) {
      auditDiagnosis.push("Website is unreachable");
    } else if (lead.websiteAudits) {
      const leadContext = {
        companyName: lead.companyName,
        website: lead.website,
      };
      const { system, user } = await buildAuditDiagnosisPrompt(
        leadContext,
        lead.websiteAudits,
      );

      const resAuditDiagnosisSchema: Schema = {
        type: GenAIType.OBJECT,
        properties: {
          auditDiagnosis: {
            type: GenAIType.ARRAY,
            items: { type: GenAIType.STRING },
          },
        },
        required: ["auditDiagnosis"],
      };

      const response = await this.generateContext(
        system,
        user,
        resAuditDiagnosisSchema,
      );

      const parsedDiagnosis = await this.parseModelResponse(
        response,
        generatedAuditSchema,
      );

      auditDiagnosis.push(...parsedDiagnosis.auditDiagnosis);

      // Clean up screenshot files
      await Promise.all(
        lead.websiteAudits.viewports.map((port) =>
          this.deleteScreenshot(port.screenshotPath),
        ),
      );
    } else {
      auditDiagnosis.push("Missing audit data");
    }

    return auditDiagnosis;
  }

  async generateEmail(lead: LeadAuditDetails) {
    const hasWebsite = lead.website !== null;

    const input = {
      companyName: lead.companyName,
      hasWebsite,
      websiteReachable: lead.websiteReachable,
      auditDiagnosis: lead.auditDiagnosis,
    };

    const resEmailSchema: Schema = {
      type: GenAIType.OBJECT,
      properties: {
        subject: { type: GenAIType.STRING },
        body: {
          type: GenAIType.STRING,
        },
      },
      required: ["subject", "body"],
    };

    const response = await this.generateContext(
      EMAIL_SYSTEM_PROMPT(input),
      "Generate the email",
      resEmailSchema,
    );

    const emailDto = await this.parseModelResponse(
      response,
      generatedEmailSchema,
    );
    const emailDraft = JSON.stringify(emailDto);
    return emailDraft;
  }

  private generateContext(
    systemInstruction: string,
    contents: string | Part | Part[] | Content | Content[],
    responseSchema: Schema,
  ) {
    return this.genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });
  }

  private parseModelResponse<T>(
    modelResponse: GenerateContentResponse,
    schema: ZodType<T>,
  ) {
    const result = modelResponse.text;
    if (!result) throw new Error("Failed to generate response");

    let parsed: unknown;
    try {
      parsed = JSON.parse(result);
    } catch {
      throw new Error("Invalid JSON response");
    }

    const validation = schema.safeParse(parsed);
    if (!validation.success) {
      const formatted = formatZodIssues(validation.error.issues);
      throw new Error(`Invalid model response shape:\n${formatted}`);
    }

    return validation.data;
  }

  private async deleteScreenshot(screenshotPath: string) {
    if (!screenshotPath) return;

    try {
      await fs.unlink(screenshotPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}
