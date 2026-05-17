import { GoogleGenAI } from "@google/genai";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { IsString, validateOrReject } from "class-validator";
import pLimit from "p-limit";
import { EnvProvider } from "src/config/env/env.provider";
import { EMAIL_SYSTEM_PROMPT } from "src/utils/system-prompts";

class GeneratedEmailDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;
}

export interface LeadWithEmail {
  emails: string[];
  audit: {
    hasWebsite: boolean;
    websiteIsReachable: boolean;
    diagnosis: string[];
  };
  name: string;
  mapLink: string;
  address: string;
  phone: string;
  website: string;
}

@Injectable()
export class OutreachService {
  private readonly genAI: GoogleGenAI;

  constructor(private readonly env: EnvProvider) {
    this.genAI = new GoogleGenAI({ apiKey: this.env.get("GEMINI_API_KEY") });
  }

  async generateEmail(leads: LeadWithEmail[]) {
    const limit = pLimit(2);

    const leadWithDrafts = await Promise.all(
      leads.map((lead) =>
        limit(async () => {
          // WE WON'T NEED THIS LATER WHEN WE HAVE PROPER AUDIT
          if (lead.audit.hasWebsite && lead.audit.websiteIsReachable) {
            return lead;
          }

          const input = { company: lead.name, audit: lead.audit };

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

          return {
            ...lead,
            emailDraft: { subject: dto.subject, body: dto.body },
          };
        }),
      ),
    );

    return leadWithDrafts;
  }
}
