import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsOptional()
  customerName: string;

  @IsString()
  @IsOptional()
  customerPhone: string;

  @IsString()
  @IsOptional()
  invoiceNo: string;

  @IsString()
  @IsOptional()
  note: string;

  @Type(() => Date)
  @IsOptional()
  date: Date;

  @IsString()
  @IsOptional()
  subtotal: string;

  @IsString()
  @IsOptional()
  total: string;

  @IsString()
  @IsOptional()
  due: string;

  @IsString()
  @IsOptional()
  paid: string;

  @IsString()
  @IsOptional()
  discount: string;

  @IsUUID()
  @IsOptional()
  storeId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items?: CreateInvoiceItemDto[];
}

export class CreateInvoiceItemDto {
  @IsUUID()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  price: string;

  @IsString()
  total: string;
}

export type CreateInvoiceItem = {
  invoiceId: string;
  productId: string;
  quantity: number;
  price: string;
  total: string;
};
