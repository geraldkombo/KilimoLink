import { IsArray, IsInt, IsOptional, IsString, Length, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class PlaceOrderDto {
  @IsString()
  @Length(2, 120)
  buyerName!: string;

  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @IsOptional()
  @IsString()
  buyerOrganization?: string;

  @IsString()
  @Length(2, 200)
  deliveryLocation!: string;

  @IsString()
  @Length(2, 80)
  county!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

