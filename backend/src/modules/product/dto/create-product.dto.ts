import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsOptional()
  price: number = 0;

  @Type(() => Number)
  @IsOptional()
  stock: number = 0;

  @IsString()
  @IsOptional()
  barcode: string = Math.floor(Math.random() * 1000000000).toString();

  @IsUUID()
  unitId: string;

  @IsUUID()
  storeId: string;
}
