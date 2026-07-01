import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class LeadDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  mapLink!: string;

  @IsString()
  @IsOptional()
  address!: string | null;

  @IsString()
  @IsOptional()
  phone!: string | null;

  @IsString()
  @IsOptional()
  website!: string | null;
}

export type Lead = InstanceType<typeof LeadDto>;

export class LeadValidationListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LeadDto)
  leads!: LeadDto[];
}
