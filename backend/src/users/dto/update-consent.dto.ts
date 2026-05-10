import { IsBoolean } from 'class-validator';

export class UpdateConsentDto {
  @IsBoolean()
  consentSms!: boolean;

  @IsBoolean()
  consentPush!: boolean;
}

