import { GoogleGenAI } from "@google/genai";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { IsString, validateOrReject } from "class-validator";
import { EnvProvider } from "src/config/env/env.provider";
import { EMAIL_SYSTEM_PROMPT, OutreachInput } from "src/utils/system-prompts";

class GeneratedEmailDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;
}

@Injectable()
export class OutreachService {
  private readonly genAI: GoogleGenAI;

  constructor(private readonly env: EnvProvider) {
    this.genAI = new GoogleGenAI({ apiKey: this.env.get("GEMINI_API_KEY") });
  }

  async generateEmail(input: OutreachInput) {
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

    return { subject: dto.subject, body: dto.body };
  }
}
