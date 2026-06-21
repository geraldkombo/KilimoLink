import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber('KE')
  phone!: string;

  @IsString()
  @Length(4, 8)
  code!: string;
}

