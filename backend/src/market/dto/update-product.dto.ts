import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceKes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  unit?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

