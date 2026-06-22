import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  receiverId!: string;

  @IsString()
  @MinLength(1)
  text!: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}
