import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsString()
  @Length(2, 80)
  category!: string;

  @IsInt()
  @Min(0)
  priceKes!: number;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsString()
  @Length(1, 20)
  unit!: string;

  @IsString()
  @Length(0, 1000)
  description!: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

