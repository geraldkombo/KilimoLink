import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class AdminLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 200)
  password!: string;

  @IsOptional()
  @IsString()
  @Length(6, 10)
  totp?: string;
}

