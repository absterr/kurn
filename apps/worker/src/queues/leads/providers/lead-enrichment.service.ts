import { GoogleGenAI } from "@google/genai";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  validateOrReject,
} from "class-validator";
import { EnvProvider } from "@/config/env/env.provider";
import { EMAIL_SYSTEM_PROMPT } from "@/utils/system-prompts";
import { AuditedLead } from "../processors/lead-enrichment.processor";

class GeneratedEmailDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;
}

class GeneratedAuditDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  auditDiagnosis: string[];
}

export interface LeadAuditDetails {
  companyName: string;
  website: string | null;
  emails: string[] | null;
  websiteReachable: boolean | null;
  auditDiagnosis: string[] | null;
}

@Injectable()
export class LeadEnrichmentService {
  private readonly genAI: GoogleGenAI;

  constructor(private readonly env: EnvProvider) {
    this.genAI = new GoogleGenAI({ apiKey: this.env.get("GEMINI_API_KEY") });
  }

  async diagnoseLead(lead: AuditedLead) {}

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
