import { IsString, IsNumber, IsOptional, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Fresh Organic Kale' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Grown in urban vertical farms.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  price!: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: 'Vegetables' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: '+254712345678' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: { lat: -1.28, lng: 36.81, address: 'Nairobi' } })
  @IsObject()
  location!: {
    lat: number;
    lng: number;
    address?: string;
  };
}
