import { IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
  @IsPhoneNumber('KE')
  phone!: string;
}

