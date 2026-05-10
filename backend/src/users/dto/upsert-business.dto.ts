import { IsBoolean, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { BusinessType } from '@prisma/client';

export class UpsertBusinessDto {
  @IsBoolean()
  youthLed!: boolean;

  @IsBoolean()
  womenLed!: boolean;

  @IsEnum(BusinessType)
  businessType!: BusinessType;

  @IsString()
  @Length(2, 80)
  sector!: string;

  @IsString()
  @Length(2, 80)
  county!: string;

  @IsString()
  @Length(1, 80)
  businessSize!: string;

  @IsOptional()
  @IsString()
  agpoCertificate?: string;
}

