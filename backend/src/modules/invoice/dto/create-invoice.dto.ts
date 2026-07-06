import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsOptional()
  customerName: string;

  @IsString()
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
