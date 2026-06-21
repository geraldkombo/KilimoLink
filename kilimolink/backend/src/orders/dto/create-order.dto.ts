import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'prod_123' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: 'CRYPTO' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
