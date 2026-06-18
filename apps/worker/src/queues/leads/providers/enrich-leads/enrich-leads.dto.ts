import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class GeneratedEmailDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;
}

export class GeneratedAuditDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  auditDiagnosis: string[];
}
